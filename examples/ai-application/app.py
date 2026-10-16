"""Local RevaCSS application example; run from the repository root."""
import argparse
import html
import re
import secrets
import sqlite3
from contextlib import contextmanager
from decimal import Decimal, InvalidOperation
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit


def escape(value):
    return html.escape(str(value), quote=True)


def money(cents):
    return f"€{cents // 100:,}.{cents % 100:02d}"


@contextmanager
def database(path):
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    try:
        with connection:
            yield connection
    finally:
        connection.close()


def navigation(current):
    # One source renders desktop and mobile links; only one layout is active.
    links = [("dashboard", "/", "Dashboard"),
             ("create", "/projects/new", "New project")]
    items = "".join(
        f'<li><a href="{href}"'
        + (' aria-current="page"' if key == current else '')
        + f'>{label}</a></li>' for key, href, label in links
    )
    return f'''<header class="navbar-header">
<nav class="top-menu workspace-navigation" aria-label="Workspace">
  <a class="menu-brand" href="/">Project workspace</a>
  <ul class="menu-items menu-desktop">{items}</ul>
  <button type="button" class="menu-toggle menu-collapse"
          popovertarget="workspace-mobile-menu">Menu</button>
  <ul class="menu-items menu-mobile" id="workspace-mobile-menu" popover="auto">
    <li class="menu-back"><button type="button" class="menu-toggle"
        popovertarget="workspace-mobile-menu" popovertargetaction="hide">Close menu</button></li>
    {items}
  </ul>
</nav>
</header>'''


def page(title, content, current="dashboard"):
    return f'''<!doctype html>
<html lang="en" data-theme="auto" data-palette="default"
      data-shape="rounded" data-density="comfortable" data-font="system">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(title)} · Project workspace</title>
  <link rel="stylesheet" href="/assets/reva.css">
  <link rel="stylesheet" href="/assets/app.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  {navigation(current)}
  <main class="container stack" id="main">{content}</main>
</body>
</html>'''


def project_card(project):
    # Application class adds content layout; .card owns the surface contract.
    key = project["id"]
    return f'''<article class="card stack project-summary" aria-labelledby="project-{key}-title">
  <h2 id="project-{key}-title">{escape(project['title'])}</h2>
  <dl class="project-summary-meta">
    <div><dt>Owner email</dt><dd>{escape(project['owner_email'])}</dd></div>
    <div><dt>Budget</dt><dd>{money(project['budget_cents'])}</dd></div>
  </dl>
  <a href="/projects/{key}">View project</a>
</article>'''


def dashboard(projects):
    total = sum(p["budget_cents"] for p in projects)
    rows = "".join(
        f'<tr><th scope="row"><a href="/projects/{p["id"]}">{escape(p["title"])}</a></th>'
        f'<td>{escape(p["owner_email"])}</td><td>{money(p["budget_cents"])}</td></tr>'
        for p in projects
    )
    listing = f'''<div class="table-scroll" role="region" aria-label="Projects table" tabindex="0">
<table><caption>Saved projects</caption><thead><tr><th scope="col">Project</th>
<th scope="col">Owner email</th><th scope="col">Budget</th></tr></thead>
<tbody>{rows}</tbody></table></div>''' if projects else '<p>No projects yet. Create your first project to populate the dashboard.</p>'
    cards = "".join(project_card(p) for p in projects[:4])
    return page("Dashboard", f'''<h1>Project dashboard</h1>
<p>This local example reads saved records from SQLite.</p>
<a class="button" href="/projects/new">Create a project</a>
<div class="responsive"><div class="grid cols-2">
  <article class="card"><dl><dt>Saved projects</dt><dd><output>{len(projects)}</output></dd></dl></article>
  <article class="card"><dl><dt>Total budget</dt><dd><output>{money(total)}</output></dd></dl></article>
</div></div>
<section aria-labelledby="projects-heading"><h2 id="projects-heading">Projects</h2>{listing}</section>
<section aria-labelledby="recent-heading"><h2 id="recent-heading">Recent project cards</h2>
<div class="responsive"><div class="grid cols-2">{cards}</div></div></section>''')


FIELDS = {
    "title": ("Project name", "text", 'required minlength="3" maxlength="80"'),
    "owner_email": ("Owner email", "email", 'required maxlength="254" autocomplete="email"'),
    "budget": ("Budget in euros", "number", 'required min="0" max="1000000000" step="0.01"'),
}


def project_form(csrf, values=None, errors=None):
    values, errors = values or {}, errors or {}
    summary = ''
    if errors:
        items = ''.join(f'<li><a href="#field-{key}">{escape(message)}</a></li>'
                        for key, message in errors.items())
        summary = f'<section class="alert" data-variant="danger" aria-labelledby="errors-title"><h2 id="errors-title">Please correct these fields</h2><ul>{items}</ul></section>'
    fields = []
    for name, (label, kind, attributes) in FIELDS.items():
        invalid = ' aria-invalid="true"' if name in errors else ''
        described = f' aria-describedby="error-{name}"' if name in errors else ''
        error = f'<p class="field-error" id="error-{name}">{escape(errors[name])}</p>' if name in errors else ''
        fields.append(f'''<div class="form-group">
  <label for="field-{name}">{label} (required)</label>
  <input id="field-{name}" name="{name}" type="{kind}" {attributes}
         value="{escape(values.get(name, ''))}"{invalid}{described}>
  {error}
</div>''')
    return page("New project", f'''<h1>Create a project</h1>
<p>All fields are required. Values are checked again by the server before saving.</p>
{summary}
<form action="/projects" method="post" class="card stack">
  <input type="hidden" name="csrf_token" value="{escape(csrf)}">
  {''.join(fields)}
  <div class="row"><button type="submit">Save project</button>
  <a class="button secondary outline" href="/">Cancel</a></div>
</form>''', "create")


def validate(values):
    errors = {}
    if not 3 <= len(values["title"]) <= 80:
        errors["title"] = "Enter a project name between 3 and 80 characters."
    email = values["owner_email"]
    # Deliberately basic format validation; this does not verify ownership.
    if len(email) > 254 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        errors["owner_email"] = "Enter an email address such as name@example.com."
    cents = 0
    try:
        if not re.fullmatch(r"(?:0|[1-9][0-9]{0,9})(?:\.[0-9]{1,2})?", values['budget']):
            raise ValueError
        value = Decimal(values["budget"])
        if not value.is_finite() or value < 0 or value > 1_000_000_000:
            raise ValueError
        if value * 100 != (value * 100).to_integral_value():
            raise ValueError
        cents = int(value * 100)
    except (InvalidOperation, ValueError):
        errors["budget"] = "Enter a budget from 0 to 1,000,000,000 with at most two decimal places."
    return errors, cents


class Application(BaseHTTPRequestHandler):
    def session(self):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get("Cookie", ""))
        except Exception:
            cookie = SimpleCookie()
        entry = cookie.get("workspace_session")
        sid = entry.value if entry else ''
        fresh = sid not in self.server.sessions
        if fresh:
            sid = secrets.token_urlsafe(32)
            self.server.sessions[sid] = secrets.token_urlsafe(32)
        return sid, self.server.sessions[sid], fresh

    def send(self, status, body, content_type="text/html; charset=utf-8", cookie=None, location=None):
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if cookie:
            self.send_header("Set-Cookie", f"workspace_session={cookie}; Path=/; HttpOnly; SameSite=Lax")
        if location:
            self.send_header("Location", location)
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = urlsplit(self.path).path
        assets = {
            "/assets/reva.css": self.server.dist / "reva.css",
            "/assets/app.css": Path(__file__).with_name("app.css"),
        }
        if path in assets:
            return self.send(200, assets[path].read_bytes(), "text/css; charset=utf-8")
        if path == "/projects/new":
            sid, csrf, fresh = self.session()
            return self.send(200, project_form(csrf), cookie=sid if fresh else None)
        with database(self.server.database) as connection:
            if path == "/":
                projects = connection.execute("SELECT * FROM projects ORDER BY id DESC").fetchall()
                return self.send(200, dashboard(projects))
            match = re.fullmatch(r"/projects/([1-9][0-9]{0,17})", path)
            if match:
                project = connection.execute("SELECT * FROM projects WHERE id = ?", (int(match[1]),)).fetchone()
                if project:
                    notice = '<p class="alert" data-variant="success" role="status">Project saved.</p>' if urlsplit(self.path).query == 'created=1' else ''
                    return self.send(200, page(project['title'], f'<h1>Project details</h1>{notice}{project_card(project)}<a href="/">Back to dashboard</a>', current="detail"))
        self.send(404, page("Not found", '<h1>Page not found</h1><a href="/">Return to dashboard</a>'))

    def do_POST(self):
        if urlsplit(self.path).path != "/projects":
            return self.send(404, page("Not found", '<h1>Page not found</h1>'))
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 16_384:
                raise ValueError
            if self.headers.get_content_type() != 'application/x-www-form-urlencoded':
                raise ValueError
            form = parse_qs(self.rfile.read(length).decode('utf-8'), keep_blank_values=True, max_num_fields=8)
            if any(len(value) != 1 for value in form.values()):
                raise ValueError
        except (ValueError, UnicodeDecodeError):
            return self.send(400, page("Invalid request", '<h1>Invalid form request</h1><a href="/projects/new">Open a new form</a>'))
        sid, csrf, fresh = self.session()
        submitted = form.get('csrf_token', [''])[0]
        if fresh or not secrets.compare_digest(submitted.encode('utf-8'), csrf.encode('utf-8')):
            return self.send(403, page("Expired form", '<h1>Please reopen the form</h1><p>Your form session is missing or expired.</p><a href="/projects/new">Open a new form</a>'))
        values = {name: form.get(name, [''])[0].strip() for name in FIELDS}
        errors, cents = validate(values)
        if errors:
            return self.send(422, project_form(csrf, values, errors))
        with database(self.server.database) as connection:
            cursor = connection.execute(
                "INSERT INTO projects(title, owner_email, budget_cents) VALUES (?, ?, ?)",
                (values['title'], values['owner_email'], cents),
            )
            project_id = cursor.lastrowid
        self.send(HTTPStatus.SEE_OTHER, '', location=f'/projects/{project_id}?created=1')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, default=Path.cwd() / 'dist')
    parser.add_argument('--database', type=Path, default=Path.cwd() / 'artifacts/ai-application.sqlite3')
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()
    if not (args.dist / 'reva.css').is_file():
        parser.error('Missing reva.css: supply --dist pointing to a matching compiled RevaCSS dist directory.')
    args.database.parent.mkdir(parents=True, exist_ok=True)
    with database(args.database) as connection:
        connection.execute('CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, title TEXT NOT NULL, owner_email TEXT NOT NULL, budget_cents INTEGER NOT NULL CHECK(budget_cents >= 0))')
    server = HTTPServer(('127.0.0.1', args.port), Application)
    server.dist, server.database, server.sessions = args.dist.resolve(), args.database.resolve(), {}
    print(f'Project workspace: http://127.0.0.1:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
