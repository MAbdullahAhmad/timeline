# AGENTS.md

Guidance for AI agents and contributors working in this repository. Follow these conventions and workflows when reading, editing, testing, and extending the codebase.

## Scope

- Applies to the entire repository (root scope).
- If you change files under any subdirectory, these rules apply unless the user gives direct instructions that override them.

## Repository Layout

- `project/ui` — React + Vite application (main source of truth)
  - `src/` — app code (components, pages, routes, store, services, utils)
  - `public/` — static assets and data sources (e.g., `items.json`, `items.csv`)
  - `core/` — reusable utilities (e.g., `ESRouter`)
  - `vite.config.js` — path aliases and bundler config
  - `package.json` — scripts and dependencies
- `examples/abdullah` — example static deployment snapshot (usage demo). Not part of the build output.
- `docs/` — user and developer docs, data schema notes, usage guides
- `_notes/` — project planning, UI drafts, history

## Run and Build

- Dev prerequisites: Node 18+ and npm.
- Install and run locally:
  - `cd project/ui`
  - `npm install`
  - `npm run dev` (Vite dev server)
- Lint: `npm run lint`
- Production build: `npm run build` (outputs to `project/ui/dist`)
- To preview a build: `npm run preview` or serve `dist/` statically (e.g., `npx serve -s dist`).
- Example snapshot: `examples/abdullah/ui` contains a ready‑to‑serve static example; you can run `npx serve -s .` inside that folder to view it. There is no root‑level `build/` directory.
- Automated bootstrap: `scripts/install.bash` downloads a fresh copy into `./tmp`, builds the UI, prompts for a data method (`json/csv/excel/url/sheets/drive/api`), trims unused sample files, writes matching `.env` values (including `VITE_TIMELINE_API_BASE`), and emits helper scripts (`setup.bash`, `run-api.bash`, `run-ui.bash`). Prefer this when you need a clean environment or want to share a turnkey bundle.

## Data Sources (Timeline items)

- Primary schema and options are documented in `docs/TimelineData.md`.
- Supported providers (auto‑detected by default, or forced via `?method=` or `VITE_TIMELINE_DATA_METHOD`):
  - Local: `/items.json`, `/items.csv`, `/items.xlsx`
  - URL indirection: `/items.url` (points to public `.json/.csv/.xlsx`)
  - Google Sheets (public link) via `/sheets.json` (CSV or GViz)
  - Google Drive (public) via `/drive.json`
- When the API provider is used, keep `VITE_TIMELINE_BASIC_AUTH_USER/PASS` (UI) and `BASIC_AUTH_USER/PASS` (`project/api/.env`) in sync so API requests include the required Authorization header.
- Place local files under `project/ui/public/`.
- Do not break backwards compatibility in parsing: `children` may be JSON array, `a|b|c` string, or quoted comma string; IDs are strings; `level` is numeric.
- Provider priority (if not overridden): json → csv → xlsx → url → sheets → drive.

## App Architecture

- Framework: React 19 + Vite + MUI, Redux Toolkit for state, GSAP for intro animation.
- Routing: `ESRouter` wrapper around React Router; route maps live in `src/routes/`.
- State: `src/store/` with `timelineSlice` selectors and async thunks for on‑demand fetching.
- Data layer: `src/services/` providers implement `check()`, `get_root_items()`, `get_item_by_id()`, `get_children()`.
- UI: Components in `src/components/`; pages in `src/pages/`.
- Date helpers and small utilities in `src/util/`.

## Path Aliases (Vite)

- Defined in `project/ui/vite.config.js`:
  - `@` → `project/ui/src`
  - `@src` → `project/ui/src`
  - `@dist` → `project/ui/dist`
  - `@core` → `project/ui/core`
- Use aliased imports consistently (e.g., `import X from '@/components/X'`).

## Coding Conventions

- React
  - Prefer functional components with hooks.
  - Use `.jsx` for React components, `.js` for utilities.
  - Keep side‑effects inside `useEffect`; memoize selectors and derived data.
- Styling
  - Use MUI `sx` prop and theme tokens. Avoid hardcoded hex colors; prefer `theme.palette.*`.
  - Theme is dark by default; update `src/theme.js` if adjusting brand colors.
- State/Redux
  - Extend `timelineSlice` for timeline‑related state; preserve existing action shapes.
  - Selectors should be pure; thunks should delegate to `TimelineDataService`.
- Services
  - New data providers must implement `check()` and the three getters.
  - Keep parsing tolerant and consistent with CSV/XLSX/Sheets providers.
- Imports
  - Use path aliases; do not use deep relative ladders for in‑repo modules.
- Naming
  - Use descriptive names; avoid single‑letter variables.
- Comments
  - Keep code self‑explanatory; inline comments only when clarifying non‑obvious logic.

## Feature Workflow (Typical)

1) Add/adjust UI in `src/components` or `src/pages`.
2) Wire routes in `src/routes/index.js` and `src/routes/guest.js`.
3) If data shape or backend changes are needed, extend `src/services/*` and update `docs/TimelineData.md`.
4) Update selectors/thunks in `src/store/timelineSlice.js` if needed.
5) Keep examples in `project/ui/public` in sync (e.g., `items.json`).
6) Run `npm run lint` and verify via `npm run dev`.

## Do’s and Don’ts

- Do
  - Keep changes minimal and localized.
  - Maintain data schema compatibility across providers.
  - Use existing utilities (`fetch_file`, `map_date_shift`, etc.).
  - Update docs when behavior or configuration changes.
- Don’t
  - Edit `build/` manually.
  - Introduce breaking changes to item schema without updating `docs/TimelineData.md` and examples.
  - Add heavy dependencies without a clear need.
  
  (Note: There is no `build/` folder in the repo now; treat `examples/abdullah` as illustrative only.)

## Key File Pointers

- App entry: `project/ui/src/main.jsx`
- App shell: `project/ui/src/pages/App/App.jsx`
- Timeline: `project/ui/src/components/Timeline/Timeline.jsx`
- Timeline item: `project/ui/src/components/ExpandibleAccordionTimelineItem/ExpandibleAccordionTimelineItem.jsx`
- Redux slice: `project/ui/src/store/timelineSlice.js`
- Data service orchestrator: `project/ui/src/services/TimelineDataService.js`
- Providers: `project/ui/src/services/{JSON,CSV,XLSX,URL,GoogleSheets,GoogleDrive}DataService.js`
- Router wrapper: `project/ui/core/util/components/ESRouter/ESRouter.jsx`
- Theme: `project/ui/src/theme.js`
- Data examples: `project/ui/public/{items.json,items.csv,items.xlsx,items.url,sheets.json,drive.json}`
- Schema doc: `docs/TimelineData.md`
- Example static site: `examples/abdullah/ui`

## Docs and Releases

- Developer history and notes live in `docs/dev/history` and `_notes/`.
- User phase guide: `docs/user/phase-1/README.md` (keep screenshots/steps accurate when changing UX).
- When preparing a release build, prefer `project/ui/dist` from `npm run build`; package separately as needed. Example content lives under `examples/` and is not a build artifact.

## Licensing

- See `LISENCE` at repo root for the Timeline Attribution License (TAL). Preserve attribution requirements in public deployments and retain license text in source distributions.
