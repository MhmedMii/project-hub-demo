# API agreement

React calls relative `/api` URLs with credentials. Vite forwards `/api` to Python on port 8000. All response names use readable snake_case; frontend conversion belongs in `server_connection`.

## Data

- Localized text: `{ "en": "English text", "ar": "النص العربي" }`.
- Public project: `id`, `title`, `description`, `category`, `status`, `tool_path`, `created_at`, `updated_at`, `revision`.
- Admin project: public project plus `private_notes`.
- Status: `live`, `maintenance`, `development`, `archived`.
- Account: `id`, `name`, `email`, `role`, `is_active`, `is_fixed`, `revision`.
- Role: `admin`, `counselor`.
- Session response: `{ "account": Account, "expires_at": "ISO UTC time" }`; opaque cookie is never exposed in JSON.
- Error response: `{ "error": { "code": "ERROR_CODE" } }`.

## URLs

| Method | URL | Request | Response |
|---|---|---|---|
| POST | `/api/session/demo-login` | `{role}` | Session response, 200 |
| GET | `/api/session` | none | Session response, 200 |
| POST | `/api/session/logout` | none | 204 |
| GET | `/api/projects` | none | `{projects: Project[]}`, 200 |
| GET | `/api/projects/{id}` | none | `{project: Project}`, 200 |
| POST | `/api/projects` | title, description, category, status, private_notes | `{project: AdminProject}`, 201 |
| PATCH | `/api/projects/{id}` | supplied editable fields, optional expected_revision | `{project: AdminProject}`, 200 |
| DELETE | `/api/projects/{id}` | none | 204 |
| GET | `/api/accounts` | none | `{accounts: Account[]}`, 200 |
| POST | `/api/accounts` | name, email, role, is_active | `{account: Account}`, 201 |
| PATCH | `/api/accounts/{id}` | supplied editable fields, optional expected_revision | `{account: Account}`, 200 |
| DELETE | `/api/accounts/{id}` | none | 204 |

Server-generated project IDs define local tool paths `/demo/tools/{id}`. The destination is displayed in the project form; edits stay confined to fictional local tool destinations.

All URLs except demo login require a session. All writes, including demo login, require an allowed Origin. Admin writes and account reads require current admin permissions. Archived project details are unavailable to counselors. Account changes take effect on the next request. All responses use `Cache-Control: private, no-store`.

## Concurrent edits

Projects and accounts start at revision 1 and increment on each successful edit. The frontend includes the revision of the record it opened as `expected_revision` in PATCH requests. If that revision is stale, the server returns 409 `CONCURRENT_CHANGE` and leaves the record unchanged. The form keeps entered values until the user chooses to close and reload.

For compatibility, small programmatic PATCH requests may omit `expected_revision`; their supplied fields are applied atomically to the latest record. Clients sending a full form snapshot must include its revision to prevent overwriting newer fields. Creation rejects an edit revision. Updates to deleted records return 404 and cannot restore them.

Storage owns an atomic `update(identifier, transform)` operation: resolve the current record, run the action's pure transformation, check uniqueness where applicable, and store the result under one lock. Actions own validation, permission safeguards, and revision decisions.

## Demo resource limits

- Request body: at most 32 KiB, including streamed bodies, checked before JSON parsing; body reads have a 10-second deadline.
- Per connected client: 240 requests and 20 demo-login attempts per 60 seconds. Login attempts also count toward the request quota.
- Per server process: 1600 requests per 60 seconds and at most 1024 active client/quota buckets.
- Storage: at most 512 sessions, 1000 projects, and 500 accounts.
- Expired sessions are pruned on storage reads and saves. Successful login replaces the session identified by the incoming cookie; other visitors' sessions remain intact.

Rate-limit responses include `Retry-After: 60` with the default settings. All limits are per Python process. The limiter uses the connection address supplied by ASGI, not arbitrary forwarded headers read by application code. A hosted reverse proxy must be configured with an explicit trusted-proxy policy; shared/distributed quotas are not implemented.

## Error codes

- 401: `SESSION_REQUIRED`, `ACCOUNT_INACTIVE`.
- 403: `ADMIN_REQUIRED`, `ORIGIN_NOT_ALLOWED`, `FIXED_ADMIN`, `SELF_REMOVAL`.
- 404: `PROJECT_NOT_FOUND`, `ACCOUNT_NOT_FOUND`.
- 408: `REQUEST_TIMEOUT` for a stalled request body.
- 409: `EMAIL_IN_USE`, `CONCURRENT_CHANGE`.
- 413: `REQUEST_TOO_LARGE`.
- 422: `INVALID_INPUT`.
- 429: `RATE_LIMITED`, `DEMO_CAPACITY_REACHED`.
- 500: `SERVER_ERROR`.

Business validation trims text and normalizes email case. English/Arabic titles and descriptions are required. Titles: 120 characters; descriptions: 1000; categories: 80; private notes: 2000; account names: 120. Emails must use the reserved `.example` suffix and be unique. Caller-supplied IDs, fixed-admin flags, timestamps, and tool paths are rejected. Frontend form checks provide convenience; Python remains authoritative.
