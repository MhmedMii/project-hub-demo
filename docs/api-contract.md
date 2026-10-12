# API agreement

React calls relative `/api` URLs with credentials. Vite forwards `/api` to Python on port 8000. All response names use readable snake_case; frontend conversion belongs in `server_connection`.

## Data

- Localized text: `{ "en": "English text", "ar": "النص العربي" }`.
- Public project: `id`, `title`, `description`, `category`, `status`, `tool_path`, `created_at`, `updated_at`.
- Admin project: public project plus `private_notes`.
- Status: `live`, `maintenance`, `development`, `archived`.
- Account: `id`, `name`, `email`, `role`, `is_active`, `is_fixed`.
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
| PATCH | `/api/projects/{id}` | supplied editable fields | `{project: AdminProject}`, 200 |
| DELETE | `/api/projects/{id}` | none | 204 |
| GET | `/api/accounts` | none | `{accounts: Account[]}`, 200 |
| POST | `/api/accounts` | name, email, role, is_active | `{account: Account}`, 201 |
| PATCH | `/api/accounts/{id}` | supplied editable fields | `{account: Account}`, 200 |
| DELETE | `/api/accounts/{id}` | none | 204 |

Server-generated project IDs define local tool paths `/demo/tools/{id}`. The destination is displayed in the project form; edits stay confined to fictional local tool destinations.

All URLs except demo login require a session. All writes, including demo login, require an allowed Origin. Admin writes and account reads require current admin permissions. Archived project details are unavailable to counselors. Account changes take effect on the next request. All responses use `Cache-Control: private, no-store`.

## Error codes

- 401: `SESSION_REQUIRED`, `ACCOUNT_INACTIVE`.
- 403: `ADMIN_REQUIRED`, `ORIGIN_NOT_ALLOWED`, `FIXED_ADMIN`, `SELF_REMOVAL`.
- 404: `PROJECT_NOT_FOUND`, `ACCOUNT_NOT_FOUND`.
- 409: `EMAIL_IN_USE`.
- 422: `INVALID_INPUT`.
- 500: `SERVER_ERROR`.

Business validation trims text and normalizes email case. English/Arabic titles and descriptions are required. Titles: 120 characters; descriptions: 1000; categories: 80; private notes: 2000; account names: 120. Emails must use the reserved `.example` suffix and be unique. Caller-supplied IDs, fixed-admin flags, timestamps, and tool paths are rejected. Frontend form checks provide convenience; Python remains authoritative.
