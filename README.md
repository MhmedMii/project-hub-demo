# Project Hub — Team Tool Directory | Demo Version

**Bilingual Project & Access Management | Software Engineering Portfolio Project**

Project Hub brings a team's tools into one searchable workspace. Counselors browse the project directory, while admins manage projects, private notes, and fictional accounts.

The demo uses separate React and Python applications to demonstrate role-based access, bilingual interfaces, and application boundaries.

**[💻 View Source Code](https://github.com/MhmedMii/project-hub-demo)**

**Tech Stack:** React · TypeScript · Vite · Python · FastAPI · pytest · Vitest · Playwright

> **Demo Version:** Starter projects and accounts are fictional. Sign-in offers Admin and Counselor demo roles without Google authentication or passwords. Changes stay in the running Python server's memory and reset when that server restarts.

---

## 📌 Project Overview

Project Hub demonstrates an internal directory where a team can find its tools, see their current status, and open a project preview.

| Workspace | Purpose |
| --- | --- |
| Demo login | Choose the Admin or Counselor experience |
| Projects | Search and filter the available team tools |
| Administration | Manage projects, private notes, and fictional accounts |
| Tool preview | Open a local demonstration page for a selected project |

The starter dataset contains **12 projects and 6 accounts**. Counselors can see the 10 non-archived starter projects; admins can also see the 2 archived projects.

---

## ✨ Key Features

### Project Directory

- Search project titles, descriptions, and categories in the selected language.
- Filter projects by status.
- Browse projects in status order: Live, Maintenance, In development, then Archived.
- Open generated local tool-preview links.
- Show loading, empty, and error states.

### Project Administration

- Add, edit, and remove fictional projects.
- Maintain English and Arabic titles, descriptions, and categories.
- Change project status and manage private notes.
- Review archived projects in the admin experience.
- Confirm removal before deleting an item.
- Retain form inputs when a save fails.
- Reject outdated form saves and offer a clear close-and-reload action.

### Account & Access Management

- Add, edit, enable, disable, and remove fictional accounts.
- Assign Admin or Counselor roles.
- Validate unique email addresses using the reserved `.example` suffix.
- Protect the fixed demo admin from removal, disabling, or demotion.
- Prevent users from removing or disabling their own account.
- Re-check current account access and role on each API request.
- Apply edits atomically so concurrent changes cannot silently undo access updates.

Adding an account does not add another login button. Demo login continues to offer the two preset role experiences.

### Bilingual & Responsive Experience

- English and Arabic interfaces with full right-to-left layouts.
- Light and dark themes.
- Responsive project cards, navigation, tables, and forms.
- Language and theme preferences retained in the browser.
- Keyboard focus styles and confirmation dialogs.

---

## 🔄 How It Works

### Counselor Journey

**Choose Counselor → Browse projects → Search or filter → Open a tool preview**

1. Start the application using the local setup below.
2. Choose **Counselor** on the login page.
3. Search for a project or choose a status filter.
4. Open a project's fictional tool preview.
5. Switch language or theme to explore the other interface options.

Archived projects are excluded from counselor results. Private notes are omitted from counselor API responses.

### Admin Journey

**Choose Admin → Open administration → Manage projects or accounts → Review changes**

1. Choose **Admin** on the login page.
2. Open the administration workspace.
3. Add or edit a project using fictional bilingual content.
4. Change its status or add a private note.
5. Open the people-management tab to explore account controls.
6. Reload the page to confirm edits remain during the same server run.

Stop and restart the Python server to restore starter data and clear existing sessions. Reloading the browser alone does not reset projects or accounts.

---

## 👨‍💻 My Contribution

**Role: Software Developer**

The implementation demonstrates work across the frontend, backend, application rules, and verification, including:

- Building the React project directory and administration screens.
- Implementing Python actions for project, account, and session management.
- Separating business rules from framework and storage code.
- Defining API data contracts and boundary conversions.
- Enforcing role-based permissions and account safeguards on the server.
- Supporting Arabic, English, RTL layouts, and appearance preferences.
- Preparing fictional starter data and restart-based demo resets.
- Adding behavior tests, browser workflow tests, and dependency checks.

---

## 🛠️ Technology & Architecture

| Area | Technology |
| --- | --- |
| Frontend | React and React Router |
| Frontend language | TypeScript |
| Development server and build | Vite |
| Backend | Python and FastAPI |
| Request validation | Pydantic |
| Styling | Component stylesheets and shared CSS tokens |
| Icons | Lucide React |
| Typography | Inter, Poppins, and Cairo via Google Fonts |
| Demo storage | Python process memory, seeded from JSON |
| Backend tests | pytest |
| Frontend logic tests | Vitest |
| Browser workflow tests | Playwright with Google Chrome |

### Clean Architecture

Frontend and backend own separate source, dependencies, configuration, and tests. They communicate through **API URLs and JSON contracts**, without importing each other's implementation.

In the backend, pure business rules define entities, validation, visibility, and account safeguards. Actions use storage interfaces owned by the action layer. Outer connections implement those interfaces, and server startup supplies the concrete implementations.

In the frontend, plain data models and actions are separate from React rendering and HTTP communication. The `server_connection` boundary owns requests and JSON conversion; startup connects these implementations to the actions used by the interface.

Dependency checks verify permitted imports. These checks support architectural review; folder names alone do not establish separation of responsibilities.

### Clean Code Rules

The project follows three standing principles: **clear responsibilities, intentional dependencies, and understandable boundaries**.

- Use readable English identifiers describing each module's job.
- Separate rendering, state, network communication, business decisions, conversion, and storage.
- Give reusable logic one owner and import it where needed.
- Keep handwritten source functions within 30 lines and four parameters.
- Use short Kuwaiti Arabic comments when an explanation is needed.
- Verify behavior alongside dependency boundaries.

### Interface Design

The workspace uses the approved **Ocean blue & honey** palette, a sidebar, project cards, and management tables. Light and dark theme tokens are maintained in [`colors.css`](frontend/src/user_interface/appearance/colors.css).

---

## 📁 Project Structure

```text
project-hub-demo/
├── frontend/
│   ├── src/
│   │   ├── data_models/        # Plain application data definitions
│   │   ├── actions/            # Named operations, interfaces, and pure helpers
│   │   ├── server_connection/  # API requests and JSON conversion
│   │   ├── user_interface/     # React screens, state, languages, and styles
│   │   └── startup/            # Connect implementations and start React
│   └── tests/                  # Logic, dependency, and browser checks
├── backend/
│   ├── business_rules/         # Entities, validation, and access decisions
│   ├── actions/                # Operations and storage interfaces
│   ├── connections/            # Memory storage, demo data, and conversion
│   ├── server/                 # FastAPI routes, cookies, settings, and startup
│   └── tests/                  # API, access, dependency, and restart checks
├── docs/                       # API agreement, plans, rules, and evidence
└── README.md
```

### Architecture References

- [API agreement](docs/api-contract.md)
- [Folder responsibilities](docs/project-folder-structure.md)
- [Standing engineering rules](docs/engineering-rules.md)
- [Acceptance evidence](docs/acceptance-evidence.md)

---

## ▶️ Run Locally

**Requirements:** Git, Python 3.11 or newer, and Node.js 22.12 or newer. The implementation was verified with Python 3.14 and Node.js 24.

Clone the repository:

```bash
git clone https://github.com/MhmedMii/project-hub-demo.git
cd project-hub-demo
```

### Terminal 1 — Python Backend

Starting from the repository root:

```bash
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-lock.txt
.venv/bin/python -m uvicorn backend.server.create_server:create_server --factory --app-dir .. --host 127.0.0.1 --port 8000
```

### Terminal 2 — React Frontend

Starting from the repository root in a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** and choose Admin or Counselor.

Vite forwards `/api` requests to Python on port 8000. No database, Google account, environment file, or production credentials are required for this local demo. Google Fonts require an internet connection; fallback fonts are available.

---

## 🧪 Testing & Checks

### Backend

From `backend/`:

```bash
.venv/bin/python -m pytest
```

Checks cover API behavior, current-account access, role changes, concurrent updates, stale forms, protected fields, request/storage limits, failure logging, restart resets, unchanged starter JSON, and dependency rules.

### Frontend

From `frontend/`:

```bash
npm test
npm run check:architecture
npm run build
```

Checks cover search and filtering, form validation, edit revisions, request retries, session-state races, permitted dependencies, TypeScript, and the production frontend build.

### Browser Workflows

The Playwright configuration uses **Google Chrome**. Make sure Chrome and both applications' dependencies are installed, then run from `frontend/`:

```bash
npm run test:browser
```

The suite starts local servers when necessary and reuses servers already running. Browser workflows cover browsing, project and account changes, failed saves, stale-form conflicts, changed access, Arabic layouts, mobile sizing, and theme preferences. They create and remove fictional test items in the running demo.

Verification records are maintained in [acceptance evidence](docs/acceptance-evidence.md). A past passing run does not establish the result of a later change.

---

## 🔒 Demo Limitations & Privacy

This repository contains a **portfolio demo**, not a production identity or team-tool service.

- Starter projects, accounts, email addresses, and notes are fictional. Use fictional values when editing them.
- The two role buttons simulate sign-in; they do not verify a workplace identity.
- The backend still enforces session and role permissions on API requests.
- Project links open local fictional previews rather than working counseling tools.
- Tool destinations are generated by Python and displayed read-only in the project form.
- Changes are shared by browser sessions using the same Python server process.
- Restarting Python resets projects, accounts, and sessions; browser refreshes retain server data.
- Admin saves do not modify starter JSON files, create Git commits, or contact GitHub.
- The browser stores language and theme preferences separately from server-side demo data.
- Login and API requests have bounded rate limits. Request bodies are capped at 32 KiB with a read deadline; demo records and sessions have capacity limits. See the [API agreement](docs/api-contract.md) for their values and deployment assumptions.
- Local session cookies are HttpOnly and SameSite=Lax. HTTPS hosting requires secure-cookie and origin settings appropriate to that deployment.

The repository's setup is for local operation. It does not include a Vercel deployment configuration.

See the [security audit](docs/security-audit.md) for the original findings, remediation evidence, and remaining hosting/privacy considerations.

---

## 👨‍💻 Author

**ENG. Mohammed Mahmoud**

AI & Software Engineer

- **GitHub:** [@MhmedMii](https://github.com/MhmedMii)
- **Portfolio:** [View Portfolio](https://mohammed-mahmoud-portfolio.vercel.app/)

Built as a portfolio project to demonstrate React, TypeScript, and Python development, bilingual Arabic/English interfaces, role-based API access, and separation of application responsibilities. The demo also showcases in-memory storage, restart resets, boundary conversions, and automated logic, architecture, and browser checks.
