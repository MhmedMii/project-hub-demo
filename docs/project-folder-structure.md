# Project folders and readable names

This is the approved responsibility map used for the implementation. Source folders are now present. Small additional helpers and shared components follow the same boundaries.

Two application folders: **frontend** and **backend**. Each owns its code, dependencies, settings, and tests. The root contains documentation and design previews only.

## Three governing rules

- **Clear responsibilities:** every folder/file has one stated job. Separate UI rendering, state, requests, business decisions, and storage. Keep reusable logic with one owner.
- **Intentional dependencies:** justify each import by that job and follow the inward dependency rule. Actions use their own interfaces; startup supplies implementations. Cross-application communication uses the API agreement.
- **Understandable boundaries:** make each module's inputs, outputs, permitted dependencies, and owner clear. Use readable English names. Keep JSON conversion at the server-connection/browser-response boundary and access decisions in backend business rules.

Review question for every module: **What does it do, why does it depend on these parts, and what data crosses its boundary?** Automated dependency checks and focused behavior tests support this review.

```text
project-hub/
├── frontend/          React application
├── backend/           Python application
├── docs/              Plan and API documentation
└── design-previews/   Approved visual references
```

Names use full English words that describe the job. Examples: `languages` instead of `i18n`, `demo_data` instead of `fixtures`, `connect_parts.py` instead of `wiring.py`, and `project_requests.ts` instead of `projectGateway.ts`. Required tool filenames such as `package.json` and `vite.config.ts` retain their standard names.

## frontend

| Folder | Its job |
|---|---|
| `data_models` | Plain data definitions, independent of React and HTTP |
| `actions` | Individual user actions and pure display helpers |
| `server_connection` | Communicate with Python and translate API data |
| `user_interface` | React pages, components, screen state, languages, appearance |
| `startup` | Start React, connect parts, register page URLs |
| `tests` | Verify frontend behavior and dependency boundaries |

```text
frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── data_models/
│   │   ├── project.ts
│   │   ├── project_status.ts
│   │   ├── project_input.ts
│   │   ├── account.ts
│   │   ├── account_input.ts
│   │   └── session.ts
│   ├── actions/
│   │   ├── data_interfaces/
│   │   │   ├── project_operations.ts
│   │   │   ├── account_operations.ts
│   │   │   └── session_operations.ts
│   │   ├── sign_in.ts
│   │   ├── sign_out.ts
│   │   ├── load_session.ts
│   │   ├── load_projects.ts
│   │   ├── load_project.ts
│   │   ├── add_project.ts
│   │   ├── edit_project.ts
│   │   ├── remove_project.ts
│   │   ├── load_accounts.ts
│   │   ├── add_account.ts
│   │   ├── edit_account.ts
│   │   ├── remove_account.ts
│   │   └── display_helpers/
│   │       ├── search_projects.ts
│   │       ├── filter_projects.ts
│   │       ├── check_project_form.ts
│   │       ├── check_account_form.ts
│   │       └── format_date.ts
│   ├── server_connection/
│   │   ├── send_request.ts
│   │   ├── request_settings.ts
│   │   ├── read_server_error.ts
│   │   ├── project_requests.ts
│   │   ├── account_requests.ts
│   │   ├── session_requests.ts
│   │   ├── message_shapes/
│   │   │   ├── project_request.ts
│   │   │   ├── project_response.ts
│   │   │   ├── account_request.ts
│   │   │   ├── account_response.ts
│   │   │   ├── sign_in_request.ts
│   │   │   └── session_response.ts
│   │   └── data_conversion/
│   │       ├── read_project_response.ts
│   │       ├── write_project_request.ts
│   │       ├── read_account_response.ts
│   │       ├── write_account_request.ts
│   │       └── read_session_response.ts
│   ├── user_interface/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   └── ToolPreviewPage.tsx
│   │   ├── page_layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── project_components/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectSearch.tsx
│   │   │   └── ProjectStatusFilter.tsx
│   │   ├── admin_components/
│   │   │   ├── AdminTabs.tsx
│   │   │   ├── ProjectTable.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── AccountTable.tsx
│   │   │   └── AccountForm.tsx
│   │   ├── shared_components/
│   │   │   ├── Button.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── SelectInput.tsx
│   │   │   ├── ConfirmRemoval.tsx
│   │   │   ├── StatusLabel.tsx
│   │   │   ├── LoadingMessage.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── EmptyMessage.tsx
│   │   ├── screen_state/
│   │   │   ├── use_session.ts
│   │   │   ├── use_projects.ts
│   │   │   ├── use_project_form.ts
│   │   │   ├── use_accounts.ts
│   │   │   └── use_account_form.ts
│   │   ├── languages/
│   │   │   ├── LanguageSettings.tsx
│   │   │   ├── english.json
│   │   │   └── arabic.json
│   │   └── appearance/
│   │       ├── ThemeSettings.tsx
│   │       ├── colors.css
│   │       └── base_styles.css
│   └── startup/
│       ├── main.tsx
│       ├── App.tsx
│       ├── page_routes.tsx
│       └── connect_parts.ts
└── tests/
    ├── actions/
    ├── dependency_rules/
    └── browser_workflows/
```

Every visual page/component has its matching stylesheet beside it: for example, `ProjectCard.tsx` and `ProjectCard.css`. Stylesheets are omitted from the tree to keep it readable. Language/theme providers do not need empty component stylesheets.

The `data_interfaces` files describe the operations actions need; they contain no network calls. `send_request.ts` owns fetch/deadline/read-retry behavior. Project/account/session request files implement their corresponding operation interfaces. Message shapes describe JSON; data-conversion files translate it. Screen-state hooks manage one screen concern; components render it.

## backend

| Folder | Its job |
|---|---|
| `business_rules` | Pure entities, validation, roles, status order, access decisions |
| `actions` | One operation per file, using storage interfaces |
| `connections` | In-memory storage, reading demo data, preparing browser responses |
| `server` | FastAPI, API URLs, cookies, startup, configuration, request logging |
| `tests` | Verify rules, actions, API behavior, restart behavior, dependency boundaries |

```text
backend/
├── requirements.txt
├── requirements-dev.txt
├── business_rules/
│   ├── project.py
│   ├── project_status.py
│   ├── project_validation.py
│   ├── project_visibility.py
│   ├── account.py
│   ├── account_validation.py
│   ├── access_rules.py
│   ├── role.py
│   ├── session.py
│   └── business_errors.py
├── actions/
│   ├── storage_interfaces/
│   │   ├── project_storage.py
│   │   ├── account_storage.py
│   │   └── session_storage.py
│   ├── demo_sign_in.py
│   ├── sign_out.py
│   ├── get_session.py
│   ├── list_projects.py
│   ├── get_project.py
│   ├── add_project.py
│   ├── edit_project.py
│   ├── remove_project.py
│   ├── list_accounts.py
│   ├── add_account.py
│   ├── edit_account.py
│   └── remove_account.py
├── connections/
│   ├── memory_storage/
│   │   ├── memory_project_storage.py
│   │   ├── memory_account_storage.py
│   │   └── memory_session_storage.py
│   ├── demo_data/
│   │   ├── load_demo_data.py
│   │   ├── convert_project_data.py
│   │   ├── convert_account_data.py
│   │   ├── projects.json
│   │   └── accounts.json
│   └── browser_responses/
│       ├── counselor_project_response.py
│       ├── admin_project_response.py
│       ├── account_response.py
│       └── session_response.py
├── server/
│   ├── create_server.py
│   ├── settings.py
│   ├── connect_parts.py
│   ├── start_demo.py
│   ├── session_cookies.py
│   ├── current_user.py
│   ├── check_request_origin.py
│   ├── handle_errors.py
│   ├── log_requests.py
│   ├── request_data/
│   │   ├── project_input.py
│   │   ├── account_input.py
│   │   └── sign_in_input.py
│   └── api/
│       ├── session_routes.py
│       ├── project_routes.py
│       └── account_routes.py
└── tests/
    ├── business_rules/
    ├── actions/
    ├── api/
    ├── restart_behavior/
    └── dependency_rules/
```

Storage interfaces define needed read/write operations; memory-storage files implement them. Demo-data loading reads JSON, and separate pure converters create entities. Browser-response files choose allowed output fields. `start_demo.py` builds fresh state at Python startup. `connect_parts.py` constructs dependencies and passes them to actions. API route files connect URLs to actions; they do not decide business permissions.

## Clean Architecture with these names

Readable names preserve the dependency rules:

- Backend `business_rules` is the domain layer; `actions` is the application layer; `connections` is the adapter layer; `server` is the framework layer.
- Frontend `data_models` is the domain layer; `actions` is the application layer; `server_connection` is the adapter layer; `user_interface` and `startup` form the framework layer.
- Core data/rules cannot import UI, server, storage implementations, or network code.
- Actions depend on core data/rules and their own interfaces, not concrete connections.
- Connections implement the interfaces. Startup constructs and injects them.
- React components cannot call fetch or read Python files. Python cannot import React files.
- All cross-application communication uses HTTP URLs and JSON. The API document describes that agreement; it is not shared implementation code.

These names are intended for the product implementation. Existing HTML screenshots are design references, not the final application structure.
