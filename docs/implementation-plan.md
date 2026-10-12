# Project Hub Implementation Plan

**Goal:** implement the approved fictional React/Python project hub.
**Architecture:** independent frontend/backend, inward dependencies, API-only communication, one responsibility per module.
**Spec:** project-hub-demo-plan.md; project-folder-structure.md; api-contract.md.
**Execution:** native execution in this session; one independent final review.

## Global constraints

- Entirely fictional project/account data; Ocean blue & honey workspace.
- React/TypeScript in frontend; Python/FastAPI in backend.
- At most 30 lines per function, four parameters, readable English names, Kuwaiti Arabic comments when needed.
- Pure rules separated from side effects; actions own interfaces.
- Memory resets on Python restart, not browser refresh.

## Review focus

- Direct access to archived details/private notes must be prevented server-side.
- Disabled accounts and changed roles must be reflected on the next request.
- Protected account flags/IDs must not be accepted from caller input.
- Failed saves must retain form inputs; writes must not be automatically retried.
- Arabic, narrow screens, and dark mode must work across admin dialogs as well as browsing.

## Task 1: API agreement and test setup

- [ ] Write the API contract and isolated dependency manifests.
- [ ] Add backend API tests for login, redaction, CRUD, protected accounts, access revocation, and restart.
- [ ] Run pytest and observe missing implementation before writing server code.

Produces `create_server(settings)` and the request/response shapes in api-contract.md.

## Task 2: Python rules and actions

- [ ] Implement entities and pure validation/visibility/access functions in `backend/business_rules`.
- [ ] Implement action-owned storage interfaces and one file per action.
- [ ] Implement immutable in-memory storage and read-only fixture loading in `backend/connections`.
- [ ] Validate core actions without a web server.

Actions receive plain entities/input structures and injected project/account/session storage. They return entities or raise a business error code.

## Task 3: FastAPI boundary

- [ ] Implement startup, settings, cookies, user resolution, origin checking, and generic error responses.
- [ ] Connect session/project/account URLs to actions and allowed-field presenters.
- [ ] Run the full backend API suite and architecture/function-size checks.

Example acceptance assertion:

```python
response = counselor.get('/api/projects')
assert all(project['status'] != 'archived' for project in response.json()['projects'])
assert all('private_notes' not in project for project in response.json()['projects'])
```

## Task 4: React application boundary

- [ ] Write failing search/filter/form and request-retry tests.
- [ ] Implement plain models, operation interfaces, named actions, JSON conversion, and HTTP request handling.
- [ ] Run Vitest and frontend dependency checks.

React startup injects HTTP request implementations into actions. UI state receives actions; components do not fetch.

## Task 5: Approved interface

- [ ] Add session/language/theme providers and routes for login, projects, admin, and fictional tool previews.
- [ ] Add separate page/component/style files and focused hooks.
- [ ] Implement project/account forms with translated validation, loading/errors, successful refresh, and confirmation before removal.
- [ ] Verify the approved palette and UI in the browser.

## Task 6: Integration and completion

- [ ] Verify browser role workflows, edits retained after refresh, backend restart reset, Arabic/RTL, dark mode, and mobile.
- [ ] Run backend tests, frontend tests, both architecture checks, and TypeScript/Vite build.
- [ ] Dispatch an independent review; fix material findings and rerun relevant checks.
- [ ] Write run instructions and acceptance evidence; create a local project-only commit.
