# AI-assisted Laravel development

Boost guidance teaches a coding assistant the adapter API; it is independent of Laravel AI SDK features running inside an application.

The package ships `resources/boost/guidelines/core.blade.php` and `resources/boost/skills/revacss-development/SKILL.md`. If Laravel Boost is installed in the consuming app, run its official `php artisan boost:install` workflow and select skills when offered. Boost can discover instructions from installed Composer packages. Discovery depends on that application's Boost version and user selection; the adapter does not silently install or configure an agent.

Start with the same seven decisions documented in the [package README's AI workflow](https://github.com/eristavi/RevaCSS/blob/main/integrations/laravel/README.md#ai-implementation-workflow): version/reference, assets, native attributes, field values/errors, server/client state, application responsibilities and evidence. The focused `/ai/adapters/laravel.md` reference includes both that README and this guide. For reactive work, read the installed adapter's Livewire guide before generating bindings; stable field IDs and application authorization remain necessary.

A useful prompt:

> Build a Laravel project page using the installed RevaCSS adapter. Read its README and matching component contracts. Use native HTML or x-reva:: components, real routes, request validation and authorization. Keep application behaviours separate from the CSS core. Preserve existing project instructions about tests and release work.

For a Laravel AI feature, the same components can render prompt forms, messages, structured results and error states. Use the installed AI SDK's current documentation for provider/agent APIs. API keys remain on the server. Escape text responses; render Markdown through an application-controlled sanitizing pipeline where rich content is required. Streaming requires an application client or Livewire integration. Never render model-produced Blade/PHP or arbitrary HTML as trusted code.

For a future AI page builder, define an allowlisted structured schema, validate it in Laravel and map it to known Blade templates. Version 2's integration supplies the presentation layer; it does not execute generated templates or implement a page builder.
