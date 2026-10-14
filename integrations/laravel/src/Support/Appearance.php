<?php

namespace Reva\Laravel\Support;

use Illuminate\Contracts\Config\Repository;
use Illuminate\View\ComponentAttributeBag;
use InvalidArgumentException;

class Appearance
{
    public function __construct(private Repository $config) {}

    public function choices(): array
    {
        $choices = json_decode(file_get_contents(__DIR__.'/../../resources/contracts.json'), true, 512, JSON_THROW_ON_ERROR);
        foreach ($this->config->get('reva.palettes', []) as $name => $stylesheet) {
            if (!is_string($name) || !preg_match('/\A[a-z][a-z0-9-]*\z/D', $name) || in_array($name, ['default', 'mono'], true)) {
                throw new InvalidArgumentException('Custom palette names must be lowercase slugs distinct from built-in palettes.');
            }
            if (!is_string($stylesheet) || !preg_match('~\A(?:[a-zA-Z0-9_-]+/)*[a-zA-Z0-9_-]+\.css\z~D', $stylesheet)) {
                throw new InvalidArgumentException('A custom palette needs a relative application-owned CSS path.');
            }
            $choices['palette'][] = $name;
        }
        return $choices;
    }

    public function values(array $overrides = []): array
    {
        $values = array_replace($this->config->get('reva.appearance', []), $overrides);
        $choices = $this->choices();
        foreach ($values as $name => $value) {
            if (!isset($choices[$name]) || !is_string($value) || !in_array($value, $choices[$name], true)) {
                throw new InvalidArgumentException('Unsupported RevaCSS appearance setting: '.$name);
            }
        }
        return $values;
    }

    public function attributes(array $overrides = []): ComponentAttributeBag
    {
        $attributes = [];
        foreach ($this->values($overrides) as $name => $value) {
            $attributes['data-'.$name] = $value;
        }
        return new ComponentAttributeBag($attributes);
    }
}
