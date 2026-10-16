# A complete RevaCSS project workspace

This runnable example connects four interface patterns to one small application:
a dashboard, a validated form, responsive navigation and a custom project card.
It uses Python 3.10+ standard-library HTTP/SQLite support and the complete
RevaCSS 2.0 core. It adds no browser JavaScript or CSS framework dependency.

## Run from the repository

From the repository root, use an existing matching `dist/reva.css`:

```sh
python3 examples/ai-application/app.py --dist ./dist
```

Open `http://127.0.0.1:8080`. If the compiled stylesheet is missing, obtain the
matching compiled distribution or follow the repository's CSS build workflow.
The application does not install packages or rebuild RevaCSS when started.

The database is created at `artifacts/ai-application.sqlite3`. It starts empty;
choose **New project**, save a record, and return to the dashboard. Records
survive application restarts. Form sessions are in memory, so reopen a form
after restarting the server. To use a separate database or port:

```sh
python3 examples/ai-application/app.py --dist ./dist --database ./artifacts/my-projects.sqlite3 --port 8081
```

## Run the downloaded example

The online application guide provides `app.py` and `app.css` downloads. Keep
them in the same directory, beside a `dist/` directory containing your matching
`reva.css`, then run:

```sh
python3 app.py --dist ./dist
```

The CSS URL `/assets/reva.css` is served from the selected directory. Application
CSS is served from the `app.css` beside the Python file. These paths are real
server routes; no placeholder form destination or CDN URL is needed.

## What each pattern demonstrates

| Pattern | Complete implementation | Application connection |
| --- | --- | --- |
| Dashboard | Native metric cards, empty state, scrollable labelled table and responsive project-card grid | `dashboard()` renders SQLite rows and computes the displayed count and total budget. |
| Validated form | Native labels, names and constraints; error summary, field associations and preserved escaped values | `POST /projects` checks the session CSRF token and `validate()` rules, then uses a parameterized INSERT. |
| Responsive navigation | A complete `.top-menu` with desktop links, mobile native popover and close control | `navigation()` builds both layouts from one route list and sets `aria-current` for the active destination. |
| Custom component | `.card.project-summary` with unique heading ID, a native definition list and detail link | `project_card()` renders the same saved data on the dashboard and detail route; `app.css` adds content layout using public tokens. |

The `.responsive` wrapper sits outside the grid and cards. Settings on `html`
provide shared system colour mode, palette, shape, density and font. Cards use
the core's solid material; no optional material or font stylesheet is needed.
For Glass, load the matching extension and apply it through documented surface
hooks rather than adding a custom background/blur implementation.

## Routes and state

| Request | Result |
| --- | --- |
| `GET /` | Dashboard of saved projects; explicit empty state before the first record. |
| `GET /projects/new` | Form and a session-bound CSRF token; HTTP-only, SameSite cookie. |
| `POST /projects` with missing/expired session or token | HTTP 403 with a link to reopen the form. |
| `POST /projects` with invalid fields | HTTP 422; visible error summary and field messages, escaped previous values. |
| `POST /projects` with valid fields | Save title, owner email and integer budget cents; HTTP 303 to the detail route. |
| `GET /projects/{id}` | Saved project card; a success message after the create redirect. |
| Unknown project or route | HTTP 404. |
| `GET /assets/reva.css` and `GET /assets/app.css` | Explicit stylesheet routes; arbitrary filesystem paths are not served. |

Native browser validation remains enabled. A browser may prevent an invalid
submission before it reaches the server; HTTP 422 is the server response when
invalid data does reach it. RevaCSS styles `aria-invalid` and field markup; the
application creates all messages and state. A full page response exposes those
messages in HTML without depending on a JavaScript announcement routine.

The title must be 3–80 characters. The email check is deliberately basic format
validation and does not verify address ownership or send email. Budget accepts
ordinary nonnegative decimal notation up to one billion euros, with at most two
decimal places; the server stores integer cents, not binary floating-point money.

## Adapt it to an existing application

Keep the markup contracts when moving the rendering functions into your own
templates or adapter components. Replace the example HTTP/SQLite layer with the
application's actual routes, database, request validation and session/CSRF
facilities. The places to change are the route handlers, `validate()`,
`navigation()` and the database calls; RevaCSS needs no core modification.

This local example binds only to `127.0.0.1`. It is a single-workspace teaching
application with no sign-in, user permissions, email delivery, editing or
deletion. An authenticated product must scope reads and writes to its authorized
users through its application framework. The standard-library development server
and in-memory sessions are not a production hosting architecture.

## Recorded verification

Live HTTP checks covered the empty dashboard, form/session token, rejected CSRF,
invalid requests and escaped field re-rendering, successful save/redirect,
detail/dashboard data, stylesheets and unknown routes. Rendered HTML checks
covered unique IDs and matching labels, popover targets and error descriptions.
These checks exercise the example application; they do not establish browser,
screen-reader or real-device acceptance. Those reviews remain deferred.
