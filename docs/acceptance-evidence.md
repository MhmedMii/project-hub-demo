# Acceptance evidence

## Behavior and boundaries

| Requirement | Implementation | Verification |
|---|---|---|
| Demo Admin/Counselor login | backend/actions/demo_sign_in.py; frontend/pages LoginPage | Session API tests and browser workflows |
| Counselor project restrictions | business_rules/project_visibility.py; counselor_project_response.py | API redaction/detail tests; browser archived-route test |
| Server-owned admin permissions | business_rules/access_rules.py; all mutation actions | Direct API forbidden-action/account-protection tests |
| Search/status order/filter | visible_projects; frontend search_projects/filter_projects | Backend sorted results; unit and browser browsing checks |
| Project management | named add/edit/remove actions and ProjectForm/ProjectManagement | API CRUD and bilingual browser CRUD |
| Account management | named account actions and AccountForm/AccountManagement | API CRUD, duplicate email, fictional domain, browser CRUD |
| Fixed admin and self access | access_rules and forbidden protected request fields | API protection tests and browser disabled removal |
| Current permissions | get_session resolves current account each request | Revocation/role API tests; live demotion browser regressions |
| No stale protected UI after role/identity change | keyed AuthenticatedPage subtree; screen request generations | Archived-preview and outstanding-read browser regressions |
| Refresh retains edits; restart restores fixtures | fresh connect_parts in start_demo lifespan | Browser reload test; restart/fixture-byte tests |
| Local fictional tool links | prepare_new_project; ToolPreviewPage | Browser navigation and archived-detail test |
| Language/theme/mobile | LanguageSettings, ThemeSettings, logical CSS | 106 matching translation keys; RTL/dark/mobile dialog browser test |
| Failure and recovery | request_once/send_request; submit_form | Read retry/write-no-retry tests; failed-save retention browser workflow |
| Race-safe sessions | session request generations; guarded logout failures | Three session-state unit regressions |
| Readable modular code | independent frontend/backend; module ownership | Both dependency checks, 30-line/four-parameter source checks, independent review |
| Fictional data only | backend/connections/demo_data; .example account validation | Fixture review; protected input and real-domain rejection tests |

## Commands

- Backend: `.venv/bin/python -m pytest` from backend.
- Frontend: `npm test`, `npm run check:architecture`, `npm run build` from frontend.
- Browser: `npm run test:browser` from frontend (local Chrome).

Current result: 26 backend tests, 10 frontend tests, and 7 browser workflows passed. Frontend architecture/clean-code checks cover 114 modules; backend source checks are part of pytest. TypeScript and Vite production build passed. Independent review findings were reproduced with failing tests, fixed, and verified with the complete browser suite. No reviewer findings remain deferred.

## Implementation decisions

1. Project-local repository on a feature branch avoids modifying the existing home-directory repository.
2. The user's explicit instruction to start authorized native implementation without another approval round.
3. Tool URLs are generated local demo destinations and displayed read-only, rather than editable external links.
4. Runtime is a single local Python process; hosting and multi-process memory synchronization are not implemented.
5. Obsidian was unavailable; the user's confirmed brief and approved plan were used.
