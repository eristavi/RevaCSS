"""Static contract evaluation of one recorded AI-generated fixture batch.

This is a focused evaluator, not a general HTML/CSS/accessibility validator.
It does not call a model, open a browser or prove application behaviour.
"""
import argparse
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


class Element:
    def __init__(self, tag, attributes, parent=None):
        self.tag, self.attributes, self.parent = tag, dict(attributes), parent
        self.children = []

    @property
    def classes(self):
        return set((self.attributes.get('class') or '').split())

    def within(self, name):
        item = self
        while item:
            if name in item.classes:
                return True
            item = item.parent
        return False


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.elements, self.stack = [], []
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        parent = self.stack[-1] if self.stack else None
        node = Element(tag, attributes, parent)
        if parent:
            parent.children.append(node)
        self.elements.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break


def evaluate(source, scenario, fixture_path, options):
    nodes = Document(source).elements
    failures = []
    def require(condition, code):
        if not condition:
            failures.append(code)
    tags = {n.tag for n in nodes}
    classes = set().union(*(n.classes for n in nodes))
    ids = [n.attributes['id'] for n in nodes if 'id' in n.attributes]
    id_map = {n.attributes['id']: n for n in nodes if 'id' in n.attributes}
    require(len(ids) == len(set(ids)), 'duplicate-id')
    require(all(value and not re.search(r'\s', value) for value in ids), 'invalid-id')
    require({'html', 'head', 'body', 'main', 'title'} <= tags and source.lower().startswith('<!doctype html>'), 'complete-document')
    require(any(n.tag == 'meta' and n.attributes.get('name') == 'viewport' for n in nodes), 'viewport')
    require(all(tag in tags for tag in scenario['requiredTags']), 'required-tags')
    require(set(scenario['requiresClasses']) <= classes, 'required-classes')
    foreign = {'btn', 'btn-primary', 'navbar-collapse', 'metric'} - set(scenario.get('applicationClasses', []))
    require(not (classes & foreign), 'foreign-framework-class')
    hrefs = {n.attributes.get('href') for n in nodes if n.tag == 'a'}
    require(set(scenario['requiredLinks']) <= hrefs, 'required-links')
    require('#' not in hrefs, 'placeholder-link')
    for href in hrefs:
        if href and href.startswith('#'):
            require(href[1:] in id_map, 'missing-fragment-target')
    styles = [n.attributes['href'] for n in nodes if n.tag == 'link' and n.attributes.get('rel') == 'stylesheet']
    names = {Path(href).name for href in styles}
    require(all((fixture_path.parent / href).is_file() for href in styles), 'missing-stylesheet')
    expected_core = 'reva.scoped.css' if scenario['build'] == 'scoped' else 'reva.css'
    require(expected_core in names, 'core-build')
    require(not {'reva.css', 'reva.scoped.css'} <= names, 'mixed-complete-builds')
    if scenario['build'] == 'scoped':
        require('reva' in classes, 'missing-scoped-boundary')
        require(all(n.within('reva') for n in nodes if n.classes & {'card', 'top-menu', 'form-group'}), 'outside-scoped-boundary')
        require(not any(name in names for name in ['reva.glass.css', 'reva.soft.css', 'reva.button-materials.css']), 'global-extension-in-scoped-build')
        require('host-content' in id_map and not id_map['host-content'].within('reva'), 'outside-host-content')
    roots = [n for n in nodes if ('reva' in n.classes if scenario['build'] == 'scoped' else n.tag == 'html')]
    require(any(all(n.attributes.get('data-'+key) == value for key, value in scenario['shared'].items()) for n in roots), 'shared-defaults')
    suffix = '.scoped.css' if scenario['build'] == 'scoped' else '.css'
    for n in nodes:
        a = n.attributes
        for key, value in a.items():
            if key.startswith('data-'):
                name = key[5:]
                if name in scenario.get('applicationAttributes', []):
                    continue
                require(name in options and value in options.get(name, {}).get('values', [])
                        or name == 'palette' and value in scenario.get('customPalettes', []), 'unsupported-attribute-value')
        material = a.get('data-material')
        if material in ['glass', 'soft', 'veil']:
            require('reva.'+material+suffix in names, 'missing-material-extension')
        if a.get('data-button-material') not in [None, 'default']:
            require('reva.button-materials'+suffix in names, 'missing-button-material-extension')
        if 'data-appearance' in a and (n.tag == 'button' or 'button' in n.classes):
            require(False, 'button-appearance-target')
        require(not {'card', 'responsive'} <= n.classes, 'containment-on-card')
        for attribute in ['aria-labelledby', 'aria-describedby']:
            for target in (a.get(attribute) or '').split():
                require(target in id_map, 'missing-aria-reference')
        if n.tag == 'label' and 'for' in a:
            require(a['for'] in id_map, 'missing-label-target')
        if n.tag in ['input', 'select', 'textarea'] and a.get('type') != 'hidden':
            target = a.get('id')
            labelled = any(x.tag == 'label' and x.attributes.get('for') == target for x in nodes) if target else False
            parent = n.parent
            while parent:
                labelled = labelled or parent.tag == 'label'
                parent = parent.parent
            require(labelled or bool(a.get('aria-label') or a.get('aria-labelledby')), 'unlabelled-control')
            require(bool(a.get('name')), 'missing-control-name')
        if 'popovertarget' in a:
            panel = id_map.get(a['popovertarget'])
            require(n.tag == 'button' and a.get('type') == 'button', 'native-popover-trigger')
            require(panel is not None and 'popover' in panel.attributes, 'missing-popover-target')
        if 'table-scroll' in n.classes:
            require(a.get('role') == 'region' and a.get('tabindex') == '0'
                    and bool(a.get('aria-label') or a.get('aria-labelledby')), 'scroll-region-label')
        if n.tag == 'details':
            require(bool(n.children) and n.children[0].tag == 'summary', 'disclosure-structure')
        if n.tag == 'output':
            require(n.parent is not None and n.parent.tag == 'dd' and n.parent.parent is not None
                    and n.parent.parent.tag == 'dl' and n.within('card'), 'metric-structure')
    for material in ['glass', 'soft', 'veil', 'button-materials', 'motion', 'selects']:
        extension = 'reva.'+material+suffix
        if extension in names and expected_core in names:
            ordered = [Path(href).name for href in styles]
            require(ordered.index(extension) > ordered.index(expected_core), 'extension-order')
    if scenario.get('requiresMaterial'):
        require(any(n.attributes.get('data-material') == scenario['requiresMaterial'] for n in nodes), 'material-selection')
    if scenario['id'] == 'dashboard':
        require(sum(n.tag == 'output' for n in nodes) == 2, 'metric-count')
    if scenario.get('requiresPopover'):
        require(any(n.attributes.get('popover') == 'auto' for n in nodes), 'native-popover')
        require(any(n.attributes.get('popovertargetaction') == 'hide' for n in nodes), 'popover-close')
        require(not any(n.attributes.get('role') in ['menu', 'menuitem', 'dialog'] for n in nodes), 'unsupported-widget-claim')
        for mobile in [n for n in nodes if 'menu-mobile' in n.classes]:
            require(mobile.tag == 'ul' and mobile.attributes.get('popover') == 'auto'
                    and mobile.parent is not None and 'top-menu' in mobile.parent.classes, 'mobile-menu-structure')
    if scenario.get('requiresSolidReset'):
        require(any('card' in n.classes and n.attributes.get('data-material') == 'solid' for n in nodes), 'solid-reset')
    if scenario.get('formAction'):
        require(any(n.tag == 'form' and n.attributes.get('action') == scenario['formAction']
                    and n.attributes.get('method') == 'post' for n in nodes), 'form-endpoint')
    if scenario.get('requiresErrorState'):
        require(any(n.attributes.get('aria-invalid') == 'true' and n.attributes.get('aria-describedby') for n in nodes), 'error-state')
        require('&lt;&quot;' in source, 'escaped-previous-value')
        require(any(n.tag == 'input' and n.attributes.get('name') == 'title'
                    and 'required' in n.attributes and n.attributes.get('minlength') == '3' for n in nodes), 'native-field-constraints')
    return sorted(set(failures))


def run():
    specification = json.loads((ROOT / 'tests/ai/scenarios.json').read_text())
    options = json.loads((ROOT / 'tokens/options.json').read_text())
    cases, sources, paths = {}, {}, {}
    for scenario in specification['scenarios']:
        path = ROOT / 'tests/ai/fixtures' / scenario['file']
        source = path.read_text()
        cases[scenario['id']] = scenario
        sources[scenario['id']], paths[scenario['id']] = source, path
    positives = []
    for key, scenario in cases.items():
        failures = evaluate(sources[key], scenario, paths[key], options)
        positives.append({'scenario': key, 'pass': not failures, 'failures': failures,
                          'sha256': hashlib.sha256(sources[key].encode()).hexdigest()})
    # Deliberate single changes check that the evaluator rejects real mistakes.
    mutations = [
        ('unsupported-value', 'landing', 'data-shape="rounded"', 'data-shape="round"', 'unsupported-attribute-value'),
        ('foreign-class', 'landing', 'class="button"', 'class="button btn-primary"', 'foreign-framework-class'),
        ('missing-extension', 'scoped-glass', '<link rel="stylesheet" href="../../../dist/reva.glass.scoped.css">', '', 'missing-material-extension'),
        ('missing-boundary', 'scoped-glass', 'class="reva"', 'class="host-region"', 'missing-scoped-boundary'),
        ('card-containment', 'dashboard', 'class="card"', 'class="card responsive"', 'containment-on-card'),
        ('duplicate-id', 'navigation', '<main id="main"', '<main id="evaluation-mobile"', 'duplicate-id'),
        ('broken-popover-target', 'navigation', 'popovertarget="evaluation-mobile"', 'popovertarget="missing-menu"', 'missing-popover-target'),
        ('missing-label', 'form-errors', '<label for="project-name">Project name (required)</label>', '', 'unlabelled-control'),
        ('button-appearance', 'form-errors', '<button type="submit">', '<button type="submit" data-appearance="outline">', 'button-appearance-target'),
        ('extension-order', 'scoped-glass', '<link rel="stylesheet" href="../../../dist/reva.scoped.css"><link rel="stylesheet" href="../../../dist/reva.glass.scoped.css">', '<link rel="stylesheet" href="../../../dist/reva.glass.scoped.css"><link rel="stylesheet" href="../../../dist/reva.scoped.css">', 'extension-order'),
        ('missing-material-selection', 'scoped-glass', ' data-material="glass"', '', 'material-selection'),
        ('broken-error-description', 'form-errors', 'aria-describedby="project-name-error"', 'aria-describedby="missing-error"', 'missing-aria-reference'),
        ('missing-required-constraint', 'form-errors', ' required minlength="3"', ' minlength="3"', 'native-field-constraints'),
        ('broken-metric-structure', 'dashboard', '<dd><output>3</output></dd>', '<dd>3</dd><output>3</output>', 'metric-structure'),
    ]
    controls = []
    for name, key, before, after, expected in mutations:
        assert before in sources[key], 'Mutation anchor missing: '+name
        result = evaluate(sources[key].replace(before, after, 1), cases[key], paths[key], options)
        controls.append({'control': name, 'detected': expected in result, 'expectedFailure': expected, 'failures': result})
    return {'documentationRevision': specification['documentationRevision'], 'generator': specification['generator'],
            'method': specification['method'], 'positiveScenarios': positives, 'negativeControls': controls,
            'passed': all(x['pass'] for x in positives) and all(x['detected'] for x in controls),
            'limits': ['Static markup contracts only.', 'No independent model/provider comparison.',
                       'No browser rendering, native activation, accessibility certification or application submission test.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    result = run()
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for case in result['positiveScenarios']:
            print(('PASS' if case['pass'] else 'FAIL')+' scenario '+case['scenario']+(' '+str(case['failures']) if case['failures'] else ''))
        for case in result['negativeControls']:
            print(('PASS' if case['detected'] else 'FAIL')+' detects '+case['control'])
        print('Scope: static contracts for one documented output batch; no browser or independent model evaluation.')
    raise SystemExit(0 if result['passed'] else 1)
