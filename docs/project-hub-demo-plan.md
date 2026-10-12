# Project Hub demo plan

Status: approved by the user and implemented locally. UI layout, palette, folder names, and engineering rules confirmed before implementation.

## Three governing rules

1. **Clear responsibilities:** every folder, file, function, and component has a specific job that can be described in one sentence. Rendering, screen state, HTTP communication, business decisions, and storage have separate owners. Reusable logic has one owner and is imported where needed.
2. **Intentional dependencies:** each import exists to support that module's stated job. Core rules remain independent of frameworks; actions depend on interfaces they own; outer code supplies the implementations. Frontend and backend depend on the documented API agreement, not each other's source files.
3. **Understandable boundaries:** each module makes its inputs, outputs, responsibility, and permitted dependencies clear. Names use full, readable English words. HTTP request/response shapes are documented; conversion occurs at the boundary. Business permission decisions belong to Python, and private notes leave the server only in authorized admin responses.

Before implementation is considered complete, review each module by asking: **What is its job? Why does it need each dependency? What goes in and comes out?** Dependency checks enforce allowed imports; focused behavior tests and a responsibility review verify the meaning of those boundaries.

## Agreed brief

Build a fictional project directory where counselors find and open the team's tools and admins manage projects and access. Use React with TypeScript for the frontend and Python with FastAPI for the backend. Keep each folder and file focused on one responsibility.

The frontend and backend communicate exclusively through HTTP API URLs and JSON. They do not import each other's implementation. Files within each application use imports and interfaces, following inward dependency rules.

All projects, people, emails, notes, and destinations are fictional. The interface uses the generic title **Project Hub** and no real company name or logo.

Admin changes remain in backend memory during a demo run. Restarting the Python process restores the original seed data and invalidates existing sessions. Refreshing the browser or restarting only the React dev server does not reset projects or accounts.

## Selected visual direction

Workspace layout: header, sidebar, search, status filter, and project cards. Administration uses the same shell with Projects and People tabs.

Palette: **Ocean blue & honey**.

| Role | Light-mode color |
|---|---|
| Primary buttons, brand text, icons | `#245A8D` |
| Main text | `#284055` |
| Secondary text | `#60758A` |
| Page background | `#F5F8FC` |
| Sidebar | `#EDF4FA` |
| Selected navigation | `#CBDFF0` |
| Icon backgrounds | `#E6F1FA` |
| Welcome panel | `#FFF1D5` |
| Cards | `#FFFFFF` |
| Borders | `#DDE7F0` |

Dark mode uses blue-toned dark surfaces, readable pale text, and a muted honey accent. Green, yellow, orange, and gray are reserved for status meaning, with written labels as well as color. Project cards use the same coordinated colors instead of separate category palettes.

English uses Inter/Poppins; Arabic uses Cairo. Arabic switches the entire layout to RTL, including sidebar position, spacing, labels, forms, and navigation. Mobile layouts stack cards and simplify navigation. Controls have visible labels, keyboard focus, comfortable touch targets, and readable contrast.

## Pages and workflows

### Demo login — `/login`

Two choices: **Continue as Admin** and **Continue as Counselor**. Each starts a backend session for a predefined fictional account. No Google sign-in, passwords, work emails, or real credentials.

The backend checks that the selected demo account is active. Choosing Admin is intentionally available to demo visitors; subsequent request permissions still come from the backend session.

### Projects — `/projects`

Both roles can search, filter by status, and open fictional tool destinations. Order is Live, Maintenance, In development, then Archived. Counselors never receive archived projects or private notes in API responses. Admins can see all statuses.

Search matches the active language's title, description, and category. Switching language retains the selected status filter. Empty results include a clear-search action. Loading, retryable error, and session-expired states are planned.

### Administration — `/admin`

Admin-only page with two tabs:

- **Projects:** add, edit, change status, and remove a project. Forms support English/Arabic titles and descriptions, category, a local demo destination, and private notes. Deletion asks for confirmation.
- **People:** add fictional accounts, edit roles/access, and remove accounts. A fixed demo admin cannot be deleted, disabled, or demoted. Users cannot delete or disable their own access.

Mutations are checked by the backend, and successful changes refresh the affected list. Failed saves keep the form's input and display a useful translated message.

### Fictional tool preview — `/demo/tools/:projectId`

A small local destination showing the fictional tool's name and a return-to-projects link. It demonstrates opening a tool; it does not implement counseling tools. Counselors cannot open archived projects through this route or its API.

### Access changes

Every authenticated API request looks up the session's account again. Disabling or deleting the demo counselor ends their access on their next request. Changing a role updates permissions on the next request. These checks do not use the original GitHub cache delay.

## Data and runtime

Seed files are read-only fixtures owned by Python:

- 12 projects: 6 Live, 2 Maintenance, 2 In development, and 2 Archived.
- 6 accounts: 2 admins and 4 counselors, including one fixed demo admin.
- Demo labels such as Demo Admin, Demo Counselor, and Sample Counselor.
- Reserved fictional addresses such as `admin@demo.example`.
- Tool destinations point to local `/demo/tools/` paths.

Project data includes an ID, bilingual title/description/category, status, tool path, timestamps, and admin-only private notes. Account data includes an ID, display name, fictional email, role, active flag, and fixed-admin flag. Session data includes an opaque ID, account ID, and expiry.

Startup loads fresh copies of the seed data into shared in-memory repositories. Reads and writes use these repositories; no edits are written back to fixture files. Sessions also live in memory. All browser tabs connected to the same Python process see the same current demo data.

**Approved runtime:** a local React dev server and one persistent Python process. This defines a predictable restart boundary. Hosting is a separate decision; a hosted version must preserve this agreed memory lifecycle before deployment is planned.

## Folder structure and responsibilities

The two application folders are named **frontend/** and **backend/**. Each contains its own source files, dependencies, configuration, and tests. Documentation and visual references remain outside them.

The detailed [folder structure and readable names](project-folder-structure.md) lists every planned file and explains its job. Names use full English words: `languages`, `demo_data`, `connect_parts`, `project_requests`, and `business_rules`.

| Frontend folder | Responsibility |
|---|---|
| `data_models` | Plain project/account/session data |
| `actions` | Individual user actions and pure display helpers |
| `server_connection` | HTTP requests and API data conversion |
| `user_interface` | React pages, components, screen state, languages, appearance |
| `startup` | React entry point, page routes, connecting parts |
| `tests` | Frontend checks and browser workflows |

| Backend folder | Responsibility |
|---|---|
| `business_rules` | Entities, validation, roles, visibility, status order |
| `actions` | Individual operations and storage interfaces |
| `connections` | Memory storage, initial fictional data, browser responses |
| `server` | FastAPI, API URLs, cookies, startup, settings, logging |
| `tests` | Backend rules, actions, API, restart, dependency checks |

Each visual React component has its own file and matching stylesheet, for example `ProjectCard.tsx` and `ProjectCard.css`. Each backend action has its own file, for example `add_project.py`, `edit_project.py`, and `remove_project.py`.

## Dependency rules

1. Backend business rules and frontend data models depend only on their own modules and standard language facilities.
2. Actions depend on those core modules and interfaces owned by the actions layer. They do not import React, FastAPI, fetch, or concrete storage implementations.
3. Backend connections and frontend server connections implement those interfaces and convert outside data.
4. Backend server code and frontend UI/startup code construct dependencies and connect actions to URLs/screens.
5. Backend imports never reach frontend files; frontend imports never reach backend files.
6. Components never call `fetch` directly or read demo JSON. HTTP calls exist only in `frontend/src/server_connection`.
7. API routes do not decide business permissions, ordering, or validation; they delegate to actions and business rules.

Names change; inward dependency direction does not. React startup injects server connections into its actions. Python startup injects storage implementations into its actions. Actions can be tested without a running browser, server, filesystem, or network.

## API boundary

The browser uses relative `/api` URLs; Vite proxies these to Python during local development.

| Method | URL | Access / purpose |
|---|---|---|
| POST | `/api/session/demo-login` | Start chosen fictional role session |
| GET | `/api/session` | Current session/account |
| POST | `/api/session/logout` | End current session |
| GET | `/api/projects` | Role-filtered project list |
| GET | `/api/projects/{id}` | Role-filtered project detail |
| POST | `/api/projects` | Admin creates project |
| PATCH | `/api/projects/{id}` | Admin edits project |
| DELETE | `/api/projects/{id}` | Admin removes project |
| GET | `/api/accounts` | Admin lists accounts |
| POST | `/api/accounts` | Admin adds account |
| PATCH | `/api/accounts/{id}` | Admin edits role/access |
| DELETE | `/api/accounts/{id}` | Admin removes account |

Only demo login is available without a session. Writes require an allowed origin and role. Account-management responses never include session IDs.

Use a server-owned, opaque session ID in an HttpOnly, SameSite=Lax cookie, with an eight-hour lifetime. Secure is enabled when served over HTTPS. Account access is rechecked on every request. API responses use `private, no-store`.

Errors use stable general codes translated by the frontend. Python logs diagnostic detail; the browser receives no traceback. HTTP reads have finite deadlines and one bounded retry for transient failures. Writes are not automatically retried. Interrupted/failed requests show recovery controls. Basic outer-layer logs record request duration, errors, and in-flight work; no monitoring service is needed for the demo.

## Clean code standards

- One responsibility per function/module/component.
- At most 30 lines per function and four parameters.
- Separate pure decisions and transformations from I/O orchestration.
- English identifiers; short Kuwaiti Arabic comments only where needed to explain why.
- No frontend secrets or frontend authority over access.
- Forms present convenient client feedback; the server independently validates every mutation.
- Automated import checks enforce dependency direction and the API adapter boundary.
- Backend source checks enforce function size and parameter limits; frontend dependency checks enforce its own layer boundaries.

## Delivery phases

1. **Review this plan:** confirm folder boundaries, behaviors, and local runtime assumption.
2. **Backend and API contract:** seed data, memory repositories, sessions, role rules, project/account actions, and tests.
3. **React experience:** approved workspace, login, project browsing, admin forms, language/theme support, and fictional tool preview.
4. **Integration and verification:** connect through API URLs, validate all role workflows, mobile/RTL/dark layouts, failure states, and restart behavior.

This plan does not authorize implementation by itself. Product code begins after the user approves the plan.

## Acceptance criteria

1. Initial navigation requires demo login and offers Admin and Counselor choices without Google sign-in.
2. Counselor API responses contain neither archived projects nor private notes.
3. A counselor receives a forbidden response when directly requesting admin actions.
4. Visible projects follow the agreed status order and support search/status filtering.
5. Admins can add, edit, and remove fictional projects; changes appear through the API.
6. Admins can manage fictional account access and roles.
7. Fixed-admin protection and self-removal protection hold even for direct API requests.
8. Revoked access or changed roles take effect on the account's next API request.
9. Browser refresh retains current edits; a fresh Python process restores exact fixture values and requires login again.
10. Admin mutations never modify seed files or create GitHub commits.
11. Tool buttons open local fictional destinations; archived tools remain unavailable to counselors.
12. English, Arabic/RTL, light mode, and dark mode work on login, projects, admin, forms, and dialogs.
13. Desktop and narrow mobile screens have no accidental horizontal overflow; keyboard navigation and visible focus work.
14. Loading, empty, invalid form, API failure, and expired-session states give clear next actions.
15. No real company name, logo, account, email, private note, or external tool data appears in the demo.
16. Python and React remain independent, with communication through documented API URLs/JSON only.
17. Architecture checks, meaningful backend/frontend tests, and the TypeScript production build pass.
18. Every implementation module passes the three-rule review: a clear job, justified dependencies, and understandable inputs/outputs and boundaries.

The main implementation complexity is permission correctness, keeping Arabic layouts consistent, and ensuring restart semantics across the shared repositories. The visual styling and fictional fixtures are straightforward.
