<?php

namespace Reva\Laravel\Support;

use Illuminate\Contracts\Config\Repository;
use InvalidArgumentException;
use RuntimeException;

class Assets
{
    public function __construct(private Repository $config) {}

    public function manifest(): array
    {
        $file = __DIR__.'/../../resources/assets/manifest.json';
        if (!is_file($file)) {
            throw new RuntimeException('RevaCSS Laravel assets are missing. In a source checkout, run node integrations/laravel/scripts/prepare.mjs before installing the package.');
        }
        return json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
    }

    public function directory(): string
    {
        $path = trim($this->config->get('reva.assets.path', 'vendor/reva'), '/');
        if (!preg_match('~\A[a-zA-Z0-9_-]+(?:/[a-zA-Z0-9_-]+)*\z~D', $path)) {
            throw new InvalidArgumentException('RevaCSS asset path must be a relative public directory without traversal.');
        }
        return $path.'/'.$this->manifest()['directory'];
    }

    public function url(string $file): string
    {
        if (!isset($this->manifest()['files'][$file])) {
            throw new InvalidArgumentException('Unknown RevaCSS asset: '.$file);
        }
        return asset($this->directory().'/'.$file);
    }

    public function stylesheets(?string $build = null, array $appearance = []): array
    {
        $build ??= $this->config->get('reva.assets.build', 'global');
        if (!in_array($build, ['global', 'scoped'], true)) {
            throw new InvalidArgumentException('RevaCSS build must be global or scoped.');
        }
        $files = [$build === 'global' ? 'reva.min.css' : 'reva.scoped.css'];
        if ($this->config->get('reva.assets.fonts', true)) {
            $files[] = 'reva-fonts.css';
        }
        $extensions = $this->config->get('reva.assets.extensions', []);
        $material = $appearance['material'] ?? null;
        if (in_array($material, ['glass', 'soft', 'veil'], true)) {
            $extensions[] = $material;
        }
        if (isset($appearance['button-material']) && $appearance['button-material'] !== 'default') {
            $extensions[] = 'button-materials';
        }
        foreach (array_unique($extensions) as $extension) {
            if (!in_array($extension, ['glass', 'soft', 'veil', 'button-materials', 'motion', 'selects'], true)) {
                throw new InvalidArgumentException('Unsupported RevaCSS extension: '.$extension);
            }
            $files[] = 'reva.'.$extension.($build === 'scoped' ? '.scoped' : '').'.css';
        }
        foreach ($files as $file) {
            $this->url($file); // Prevent producing a link to a missing build.
        }
        return $files;
    }
}
