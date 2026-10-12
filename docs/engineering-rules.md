# Standing engineering rules

Apply these rules to every project and every implementation, including planning, coding, refactoring, review, and verification.

## Clear responsibilities

- Give every folder, file, function, and component a specific job that can be described in one sentence.
- Separate rendering, screen state, network communication, business decisions, data conversion, and storage.
- Keep reusable logic with one owner and import it where needed.
- Keep pure decisions and transformations separate from side effects.

## Intentional dependencies

- Every import must support the importing module's stated job.
- Follow Clean Architecture: dependencies point inward; business rules remain independent of UI, web frameworks, and concrete storage.
- Actions depend on interfaces they own; outer startup code supplies concrete implementations.
- For projects with both sides, use separate `frontend/` and `backend/` folders, each owning its source, dependencies, configuration, and tests.
- Frontend and backend communicate through documented API URLs and data contracts. They do not import each other's implementation. Files within either application may connect through appropriate imports and interfaces.

## Understandable boundaries

- Make each module's responsibility, inputs, outputs, owner, and allowed dependencies understandable.
- Use full, readable English names describing the job. Prefer `languages`, `demo_data`, `connect_parts`, and `project_requests` to abbreviations or unexplained jargon.
- Give each visual component its own file and matching stylesheet where styling is needed.
- Keep data conversion at application boundaries and authoritative permission decisions in the backend.
- Document the API agreement before connecting independently implemented frontend/backend features.

## Clean code and verification

- Keep functions at most 30 lines with at most four parameters; split by responsibility when necessary.
- Use English identifiers and short Kuwaiti Arabic comments explaining why where comments are needed.
- Keep secrets out of browser code and return only fields the current user may see.
- Verify allowed imports with dependency checks where practical.
- Use appropriate behavior tests and builds for the change.
- Review every module: **What does it do? Why does it need each dependency? What goes in and comes out?**

Technology, branding, fictional versus real data, authentication, and persistence are project-specific choices established from each project's brief.
