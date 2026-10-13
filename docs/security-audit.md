# Project Hub security and API audit

Date: 13 October 2026 (Asia/Kuwait).

Original audited commit: `a396b1f0a18b570116441797a063a751be2ab764`, verified against GitHub `main` before remediation. The findings below describe that version; subsequent fixes are recorded in the remediation section.

Scope: Project Hub only. Reviewed application source, documented API endpoints, starter data, all three local Git commits, locked dependencies, local browser behavior, and available GitHub repository settings. Other projects were not audited.

## Assessment

No secrets were detected in the scanned Git history. The reviewed starter records are fictional; commit email addresses use GitHub's noreply service. No counselor access to admin-only API data was found in the tested requests.

At the original audited commit, reproduced concurrency bugs could undo account changes or restore deleted projects, and session storage had unbounded growth. Those four confirmed findings have now been addressed in source and regression tests. **Public hosting has not been security-verified**; deployment and privacy considerations below still apply.

Public source availability and safe operation of a hosted application are separate assessments. This audit did not identify a credential-disclosure reason to remove the current fictional source repository from GitHub. It does not prove the absence of every possible secret or vulnerability.

No hosted application URL was provided or independently verified. GitHub returned no deployment records; that alone does not establish that no external deployment exists. Vercel environment variables, production logs, TLS configuration, deployed files, proxy behavior, and hosting-level limits were not inspected.

## Original confirmed findings

### 1. Important: concurrent edits can undo an account demotion

Affected code:

- [`edit_account.py`](../backend/actions/edit_account.py), lines 9–15.
- [`memory_account_storage.py`](../backend/connections/memory_storage/memory_account_storage.py), lines 16–27.
- [`edit_project.py`](../backend/actions/edit_project.py), lines 12–16.
- [`memory_project_storage.py`](../backend/connections/memory_storage/memory_project_storage.py), lines 15–22.

The actions read an entity, construct a replacement, and save it in separate operations. The storage lock protects each individual operation, but not the full read/change/save sequence. A replacement built from an old snapshot can overwrite a newer update.

An isolated HTTP reproduction used this interleaving:

1. Begin changing `sample-admin`'s name and pause just before its storage save.
2. Complete another PATCH changing that account's role to counselor.
3. Resume the pending name change.

Both PATCH requests returned 200. The account was a counselor immediately after the demotion, then became an admin again when the stale name update saved. This undermines reliable access changes, although the present demo contains only fictional data and intentionally offers an Admin login.

A second reproduction submitted project-status and private-note changes concurrently. Both returned 200, but only one change remained.

Required fix: make updates atomic or use version checks that reject stale writes. Keep the concurrency operation in an action-owned storage interface and implement it in the storage adapter. Revalidate applicable account safeguards inside the operation. Add regression tests for concurrent role, active-state, and ordinary field changes.

### 2. Important: a pending edit can restore a deleted project

Affected code: the project-edit and storage-save functions identified above. The same unconditional replacement pattern also exists in account storage.

An isolated HTTP reproduction paused a project PATCH before its save, then completed DELETE for that project. DELETE returned 204 and a following GET returned 404. Resuming the pending PATCH returned 200 and the next GET returned 200: the deleted project had reappeared.

Required fix: updates must require an existing, current entity; a stale update must not create it again. Use atomic update semantics or a version/tombstone strategy, and test edit/delete races. Test the equivalent account interleaving as part of the fix.

### 3. Important before hosting: session growth has no bound or expiry cleanup

Affected code:

- [`demo_sign_in.py`](../backend/actions/demo_sign_in.py), lines 17–21.
- [`memory_session_storage.py`](../backend/connections/memory_storage/memory_session_storage.py), lines 6–22.
- [`get_session.py`](../backend/actions/get_session.py), lines 11–14.

Every successful demo login stores another session. Replacing the browser cookie does not remove its earlier session. Expired sessions are refused for authentication but remain stored. No application request-rate limit or session-capacity limit was found.

In an isolated instance, 64 consecutive demo-login requests all returned 200 and added 64 session entries. A deliberately expired session returned 401 but was still present in storage afterward.

This reproduction establishes the absence of the controls; it was not a load test and did not attempt to exhaust the running server.

Required fix: bound stored sessions, prune expired entries, and apply suitable login/request limits at the server or trusted hosting boundary. Project/account creation also needs capacity limits for an internet-facing shared demo. Apply a request-body size limit before JSON parsing, rather than relying only on field validation after parsing. No application-level body-size limit was found; possible upstream limits were not inspected.

### 4. Minor: unexpected failures are omitted from request counters

Affected code: [`log_requests.py`](../backend/server/log_requests.py), lines 19–28.

When `call_next` raises an unexpected exception, the in-flight counter is decremented, but execution skips the completed/error counters and the normal request log. The outer error handler still returns a generic, non-cacheable 500 and logs the exception.

A forced storage failure returned `{"error":{"code":"SERVER_ERROR"}}` with `Cache-Control: private, no-store`. Both the completed and error counters increased by zero.

Required fix: record completion, duration, and failure counts for exceptional requests as well as normal responses, without logging request bodies or session cookies.

## Deployment and privacy gaps

These are observed configuration limits, not demonstrated data leaks. They remain separate from the confirmed code bugs fixed below:

- **Demo identity:** anyone can choose the Admin role by design. The current authentication must remain limited to fictional demonstrations; it does not protect real workplace information.
- **Shared data:** all visitors using one Python process share its editable records. An Admin demo visitor can change or remove records another visitor is using. Private notes are private to a counselor session, not confidential from visitors who choose Admin. Isolate visitor data if independent public sessions are desired.
- **HTTPS configuration:** [`settings.py`](../backend/server/settings.py) defaults to localhost origins and `secure_cookies=False`. Those defaults support local HTTP. An HTTPS deployment needs explicit trusted origins and Secure cookies. No deployed cookie or TLS configuration was verified.
- **Document headers:** the local Vite document returned no Content-Security-Policy, X-Frame-Options, or X-Content-Type-Options headers. Configure appropriate document security headers in the actual hosting layer and verify them after deployment. This audit did not demonstrate a clickjacking exploit.
- **External fonts:** local browser requests contacted `fonts.googleapis.com` and `fonts.gstatic.com`, as declared in [`frontend/index.html`](../frontend/index.html). This shares request metadata with Google; it is not evidence that project notes or account records were transmitted. Use locally hosted fonts if external font requests are unwanted.
- **Ongoing GitHub protection:** the repository API reported Dependabot security updates, secret scanning, and secret-scanning push protection disabled. Enable available protections for future changes; the manual scans below are only a snapshot.
- **Serverless behavior:** records and sessions are process-local. Separate instances do not share them, and a restart clears them. A serverless deployment needs a deliberate demo-state design; no such deployment was tested.

The hosting recommendations follow [OWASP REST security guidance](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) and [OWASP session-management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html). They are not a certification of this implementation.

## Checks that passed

| Check | Observed result |
| --- | --- |
| Official Gitleaks 8.30.1 scanner, all three Git commits | Zero findings; downloaded binary verified against official release checksum |
| Additional credential-pattern scan | 266 historical blobs scanned; zero matches; no environment/dependency folders found in history |
| Git author/committer email review | GitHub noreply addresses only |
| npm audit, locked frontend graph | Zero known advisories; audit reported 85 dependencies |
| pip-audit, pinned Python lock | Zero known advisories across 22 packages; no skipped packages |
| Backend suite | 26 tests passed |
| Frontend logic suite | 10 tests passed |
| Frontend dependency/function checks | Passed for 114 source modules |
| Frontend TypeScript and Vite build | Passed |
| Browser workflows | 7 tests passed |
| Additional isolated API probes | 42 assertions passed |
| Stored HTML/script browser probe | Payload displayed as literal text; no injected HTML nodes or execution marker |
| Unexpected-error response probe | Generic error code, 500 status, private/no-store cache header |

The secret scans detect supported patterns; they cannot prove that arbitrary sensitive text or secrets inside images are absent. Dependency databases report known advisories, not undiscovered flaws or every form of supply-chain compromise.

## API and data controls checked

- All documented protected reads and writes were probed without a session; they returned 401.
- Counselor project/account mutations and account-list reads returned 403.
- Counselor project-list and detail responses omitted private notes; archived detail access returned 404.
- Query parameters and role-like headers did not elevate counselor access.
- Missing, null, foreign, lookalike, and trailing-slash origins were rejected for login; writes use the same server dependency.
- Fabricated and expired session identifiers were rejected.
- Session tokens were absent from JSON response bodies; cookies were HttpOnly/SameSite=Lax with the documented lifetime.
- Logout invalidated the tested session.
- Current role and account activity were rechecked on later requests. Concurrent updates remain subject to Finding 1.
- Caller-supplied identifiers, timestamps, and tool destinations were rejected.
- Invalid input and malformed JSON returned generic error codes.
- Starter JSON remained unchanged by the tested admin operations; no database, Google OAuth, email-delivery, or GitHub data-storage integration was found in the application.
- Tool destinations were server-generated local paths, and rendered project content used React text nodes.
- API documentation and guessed backend/data file URLs were unavailable through the Python routes.
- Browser access-change tests confirmed that demotion clears the protected screen and invalidates an outstanding admin read once the session refresh observes the new role.

SQL injection, file-upload handling, payment processing, and outbound backend-service credentials were not applicable to the current implementation because those features are absent.

## Recorded issue and deployment state

GitHub reported zero open issues and returned an empty deployment list. The absence of issue reports is not evidence that the application has no bugs; the findings above were reproduced during this audit.

The original 43-test suite passed despite the concurrency and resource-lifecycle gaps. Additional regression coverage accompanies the fixes.

During the original read-only audit, helpers and redacted scanner outputs were kept in temporary local files. The browser's fictional XSS-test project was removed and its audit session logged out. The user subsequently authorized the application fixes below. Dependencies and repository security settings have not been changed by remediation.

## Remediation — 13 October 2026

| Finding | Implemented fix | Regression evidence |
| --- | --- | --- |
| Concurrent edits undo newer access or project changes | Action-owned atomic storage update; pure transformation and safeguards run against the current entity under one lock | Concurrent demotion, disabling, and project-status tests in `backend/tests/concurrency/test_updates.py` |
| Pending edit restores a deleted record | Atomic update requires an existing entity and returns the relevant NOT_FOUND error after deletion | Account and project edit/delete interleavings in the same concurrency tests |
| Outdated browser form overwrites newer fields | Additive entity revisions; frontend sends `expected_revision`; stale PATCH returns 409 without writing | API stale-edit tests, frontend request-conversion tests, and browser conflict/retained-input/reload workflow |
| Session/resource growth | Expiry pruning, incoming-cookie replacement, 512-session cap, 1000-project/500-account caps, bounded per-client/global request quotas | Session/record-capacity tests and request-limit API tests |
| Unbounded request bodies | 32 KiB buffered limit before JSON parsing and 10-second body deadline | Declared/streamed oversized-body API tests and stalled-body ASGI regression |
| Missing exceptional request counters | Finalize counters and request timing from `finally`, including unexpected 500 errors | Forced-failure API test verifies generic response, cache header, completion/error counts, and zero in-flight requests |

The regression tests failed before their implementations. The 500-response harness was corrected to disable the test transport's exception rethrow; it then failed specifically on the missing counter update before the fix. The frontend stale-form browser test also failed before revision mapping and conflict recovery were connected.

For compatibility, programmatic subset PATCH requests can omit `expected_revision` and merge atomically with the latest entity. Full form snapshots must include a revision for stale-client protection; the provided frontend always does. This distinction was independently reviewed and is documented in the [API agreement](api-contract.md).

An independent read-only review found no Critical, Important, or Minor defects in the remediation. It separately probed combined login/request quotas, global/bucket limits, and window reclamation. Production identity, trusted-proxy configuration, distributed quotas, and hosting were explicitly outside this local-demo fix.

Final remediation verification: **43 backend tests, 13 frontend tests, and 8 browser workflows passed (64 total)**. Backend dependency/function checks, frontend checks for 114 modules, and the TypeScript/Vite build passed. English and Arabic have 111 matching, nonempty translation keys.

The first complete browser run had seven passes and one Chrome-launch timeout before application assertions. A subsequent full run passed all eight workflows in 39.5 seconds; no product code was changed to hide or bypass the launch failure.

The final pre-publication Gitleaks scan covered all four local commits, including remediation, and reported zero findings. No environment files, installed dependency folders, npm cache, build output, or browser-test artifacts were tracked. Dependency lockfiles were unchanged from the clean advisory scans recorded above.
