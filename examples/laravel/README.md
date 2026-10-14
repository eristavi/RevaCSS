# Reva Workspace — Laravel reference application

A runnable local example of RevaCSS's optional version 2 Laravel integration. Includes real registration/login/logout, user-owned project CRUD, server-rendered forms and pagination, saved appearance preferences, and optional reactive search using Livewire. The ordinary workspace needs no application browser JavaScript.

This is a reference app, not an authentication starter certified for production. Password reset, email verification, MFA, account recovery and organization/role policies are application extensions. There are no shared default credentials, automatic demo users or AI provider calls.

## Run locally

Requirements: PHP 8.3+ with SQLite, mbstring and standard Laravel extensions, Composer, and prepared RevaCSS integration assets. From the repository root:

```sh
npm ci
npm run build:css
node integrations/laravel/scripts/prepare.mjs
cd examples/laravel
cp .env.example .env
mkdir -p bootstrap/cache storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs
touch database/database.sqlite
composer install
php artisan key:generate
php artisan migrate
php artisan reva:install
php artisan serve
```

Open `http://localhost:8000` and register your own account. The Composer path repository links the package from this same checkout. No npm/Vite build is required for the example itself; preparation uses the compiled framework distribution. Optional local sample data can be added after registration:

```sh
php artisan reva-demo:seed your-local-account@example.test
```

This command only runs in the local environment and only adds projects to an existing account. It does not create a password or user.

## Application boundaries

The application defines its own routes, models, migrations, queries, validation and authentication. Projects are queried through the authenticated user's relationship; editing/deleting another user's record returns 404. Appearance preferences are allowlisted, stored per user and passed into the layout without changing shared configuration. Password/file fields are never repopulated by the adapter.

The responsive shell uses distinct desktop/mobile navigation slots; its repeated navigation consists only of links without IDs. The mobile menu uses native popover behaviour and needs supporting browsers. The Livewire search page loads Livewire's application scripts; other pages remain ordinary HTML forms/links.

All views can be compiled with `php artisan view:cache`. Configuration is serializable with `php artisan config:cache`; clear caches when returning to local development. Deployments need ordinary Laravel production configuration, an HTTPS origin and secure session cookie settings. Set the web server document root to `public`, keep `.env` private and use a unique application key.

## Checks

```sh
composer test
```

The feature suite uses an isolated in-memory SQLite database. It checks authentication, CRUD ownership, validation, preference isolation and real Livewire search/pagination. Browser/device/visual acceptance remains deferred for the version 2 review. Package-level checks live under `integrations/laravel/tests`.
