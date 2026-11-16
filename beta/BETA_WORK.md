# PG Beta Web Work Contract

This file is the working contract for the PatchGrid beta tester portal. It records the stable routes, data model, UI element registry, test assignment model, and deployment steps so that future edits do not casually change the tester workflow.

## Product goal

Create a private beta-testing portal at `/beta` on the existing PG website. A tester signs in once, completes the common test pack, completes the specialist pack assigned to that tester, completes the Explore PatchGrid questionnaire, and submits feedback. The App Element Selector is hidden while it is being corrected and may return in Stage 2. An admin can see progress and submitted feedback for every tester.

## Stable user flow

1. `/beta/` — login page.
2. Tester dashboard — common tests, assigned specialist tests, open exploration, saved progress, and active-time summary.
3. Structured report form — task result, UI element label, severity, reproduction steps, expected result, actual result, and optional evidence.
4. `/beta/selector.html` — visual App Element Selector. It is a lookup tool, not a submission form; it returns a copyable canonical UI label.
5. `/beta/admin/` — admin-only progress and response dashboard.

Do not rename these routes without updating this document and the deployment route map.

## Persistence and save behaviour

Production data must be stored in Cloudflare D1. Browser storage may be used only for a temporary draft cache and must never be the authoritative record.

- Save each task response explicitly with a visible **Save progress** button.
- Autosave a draft after field changes are idle for 1.5 seconds, with a clear `Draft saved` / `Save failed` status.
- Save again when the tester leaves a task or switches sections.
- Keep the last successful server save visible with a timestamp.
- Use idempotent upserts keyed by tester, assignment, and task.
- Never mark a task complete until the server confirms the saved response.
- If the server is unavailable, retain a local draft and show an error banner; do not claim the response was submitted.

## Image and video evidence

Every tester question exposes an optional evidence uploader. Evidence is stored as private objects in the Cloudflare R2 bucket `pg-beta-evidence`; D1 stores the immutable metadata linking each object to the tester, task, section, and question.

- Images: JPG, PNG, WebP, or GIF; maximum 10 MB each.
- Videos: MP4, MOV, or WebM; maximum 50 MB each.
- Maximum three files per question.
- Evidence is never stored as a base64 string in D1 and is never served from a public bucket URL.
- The admin dashboard exposes authenticated, inline “View evidence” links for the selected tester and questionnaire review.
- Apply `db/beta-evidence-migration.sql` before enabling uploads in any environment.

## Time tracking

Track session start, last activity, active seconds, inactive seconds, and session end in D1.

- Send a heartbeat every 60 seconds while the page is visible and the tester has interacted within the last 5 minutes.
- Treat keyboard, pointer, touch, navigation, and form changes as activity.
- Mark inactivity after 5 minutes without activity.
- Record active and inactive time separately; do not silently count inactive browser time as testing time.
- Show testers their own active-time total and show the admin both active and inactive totals.

## Authentication and accounts

Use server-side authentication in Cloudflare Functions. Store password hashes, never plaintext passwords. Use secure, HttpOnly, SameSite cookies for sessions and check the role server-side on every API request.

Initial accounts to seed:

- `hans.noort` — Hans Noort
- `goran.german` — Goran German
- `edgardo.actis` — Edgardo Actis
- `nehuel.soriano` — Nehuel Soriano
- `thomas.demicco` — Thomas DeMicco
- `fernando.pires` — Fernando Pires
- `ivan.polic` — Ivan Polić
- `alonso.ramos` — Alonso Ramos
- `julian.wareley` — Julian Wareley (control tester; common tests only)
- `admin` — Virtual Controllers administrator

Generate temporary passwords at seed time and provide them to the owner through a local, untracked credentials file. Do not place passwords in client JavaScript, HTML, or this document.

## D1 tables

Recommended tables:

- `users` — id, username, display_name, email, password_hash, role, active, created_at
- `assignments` — id, user_id, pack_key, title, sort_order
- `tasks` — id, pack_key, task_key, title, instructions, sort_order, required
- `responses` — id, user_id, task_id, status, ui_element_code, severity, reproduction_steps, expected_result, actual_result, notes, saved_at, submitted_at
- `sessions` — id, user_id, started_at, last_activity_at, ended_at, active_seconds, inactive_seconds
- `ui_elements` — code, screen_key, parent_code, label, selector_image, x, y, width, height, active

Use the supplied screenshots as selector assets and store hotspot coordinates as normalized values from 0 to 1 so the selector remains responsive.

## Test packs

Every tester receives:

- Common test pack — install/launch, MIDI connection, navigation, patch selection, disconnect/reconnect, stability, and structured bug reporting.
- One specialist pack matched to their setup:
  - Hans Noort — connection-method comparison and workflow interoperability.
  - Goran German — long-session and M3-88 live workflow.
  - Edgardo Actis — expanded M3-61 and direct-USB coverage.
  - Nehuel Soriano — damaged-screen replacement workflow and USB-C hub setup.
- Thomas DeMicco — expert Korg workflow and professional usability review.
- Fernando Pires — CME WIDI Bluetooth MIDI pairing, latency, and reconnection.
- Ivan Polić — Lightning iPad and hybrid USB/5-pin MIDI path comparison.
- Alonso Ramos — USB-C iPad, Yamaha Bluetooth/DIN, and M3-73/M256 coverage.
- Julian Wareley — control account for the common workflow only; no specialist pack.
- Explore PatchGrid — a collapsible, question-by-question questionnaire after required tasks are complete.

## UI element selector rules

The selector is hidden for the current beta stage because it does not work correctly. Do not link to it from the tester portal. It may be restored in Stage 2 after verification.

The selector displays clean screenshots with invisible hotspots. On hover or tap, the relevant rectangle border appears. Clicking a hotspot shows the canonical label and a **Copy label** button.

Canonical output format:

`PatchGrid → <Screen> → <Element> → <Sub-element>`

Do not ask testers to invent UI names. Keep the UI element registry stable once a beta cycle begins. Add new elements with a new code; do not reuse a code for a different region.

Current registry covered by this first data pass:

- PatchGrid Loader: `LOADER-01` to `LOADER-03`.
- PatchGrid Boot and Inventory: `BOOT-01` to `BOOT-14`, plus `BOOT-INV-01` to `BOOT-INV-09` and inventory table children `BOOT-INV-06A` to `BOOT-INV-06H`.
- PatchGrid Play: `PLAY-01` to `PLAY-26`, plus S1–S16 slot regions and Sx-A to Sx-D slot sub-elements.
- PatchGrid Edit: `EDIT-01` to `EDIT-15`, with the supplied list, notes, grid, tabs, filter, and patch-list sub-elements.
- Grid Table: `EDIT-GT-16`, plus `EDIT-GT-17-S1` to `EDIT-GT-17-S16`.
- Slot Editor: `EDIT-SE-18` to `EDIT-SE-24`, including colour, tempo, volume, EQ, and performance-control children.
- MIDI Learn: `EDIT-ML-25` to `EDIT-ML-27`, including function rows, EQ children, and performance-control children.

## Cloudflare deployment

Preferred deployment is the existing PG website plus a Cloudflare Functions/D1 layer routed under `/beta`.

1. Create or open the existing Cloudflare Pages project for `pg-web`.
2. Add the D1 binding `DB` to the deployment. The current database is `pg-beta-db`.
3. Create/bind the private R2 bucket `pg-beta-evidence` as `EVIDENCE`.
4. Apply the checked-in D1 schema, agreement migrations, and `db/beta-evidence-migration.sql`, then seed the task packs, UI registry, tester accounts, and admin account.
5. Add server-side API routes for login, logout, current user, progress, response save/submit, evidence upload/view, selector registry, and time heartbeat.
6. Deploy the existing static site with the new `/beta` directory and Functions routes.
7. Test `https://pg.virtualcontrollers.co.za/beta/` and `https://pg.virtualcontrollers.co.za/beta/selector.html` after DNS and deployment are active.

## Change-control rule

Before changing the tester workflow, update this document first. Preserve route names, response semantics, element codes, and save/error states during the beta cycle. Changes to the UI registry must be additive unless an element is genuinely removed from the application.

## Current implementation status

- [x] Stable workflow and data contract documented.
- [x] Initial beta portal UI prototype created.
- [x] Selector UI prototype created with supplied screen references.
- [x] Add initial production D1 schema, task seed, and Cloudflare Functions foundation.
- [x] Generate initial tester/admin account seed and temporary credentials outside the public website directory.
- [x] Connect frontend save, login, admin, heartbeat, question evidence upload, and admin evidence review actions to the API.
- [ ] Apply the evidence migration and create the R2 evidence bucket in each target environment.
- [ ] Connect custom domain and deploy.
- [ ] Run an end-to-end tester/admin acceptance test.
## Beta Tester Agreement

The portal displays a stage-specific agreement after tester login and before portal access. The tester must accept to continue, or may decline with a required reason. Decisions are stored in D1 in `beta_agreements` using the stage key (`stage-1` for the current 1 September 2026–30 September 2026 stage). The agreement is shown again only when the stage key changes. Administrators can review accepted, declined, and incomplete responses, including decline reasons, in the Beta Progress Overview dashboard.

Apply `db/beta-agreement-migration.sql` to the remote `pg-beta-db` database before deploying the Worker.
