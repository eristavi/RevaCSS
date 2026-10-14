<?php

return [
    // Values follow the matching RevaCSS contract, not Laravel-specific CSS.
    'appearance' => [
        'theme' => 'auto',
        'palette' => 'default',
        'font' => 'manrope',
        'shape' => 'rounded',
        'density' => 'comfortable',
        'width' => 'wide',
        'motion' => 'subtle',
    ],
    'assets' => [
        'path' => 'vendor/reva',
        'build' => 'global', // global or scoped; scoped requires a .reva boundary.
        'fonts' => true,     // Self-hosted Manrope; false uses the system fallback.
        'extensions' => [], // glass, soft, button-materials, motion, selects
    ],
    // Application-owned named palettes: 'brand' => 'css/brand.css'.
    // These are reviewed external stylesheets, never interpolated user CSS.
    'palettes' => [],
    // Explicit links('reva::pagination') works without changing app defaults.
    'pagination' => ['use_as_default' => false],
];
