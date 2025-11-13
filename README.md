# Timeline

Showcase achievements, milestones, and nested project history with a dark-themed React + Vite UI backed by a flexible Express/MySQL API.

![Timeline](./_notes/5-ui-dev-history/5-2-mockup.png)

## Highlights

- Hierarchical timeline cards with expandable children and date pins
- Multiple data providers: JSON, CSV, XLSX, URL, Google Sheets/Drive, or live API
- Optional HTTP Basic Auth enforced end-to-end when the API is selected
- GSAP intro animation, Material UI theme, Redux Toolkit store, and ESRouter wiring
- Installer script that fetches everything for you—no manual git clone required

## Quick Install

Copy the contents of [`scripts/install.bash`](scripts/install.bash), paste into any terminal, and press **Enter**. It grabs the latest build, asks which data method you want, and drops helper scripts so you can run the API/UI immediately. See [`docs/README.md`](docs/README.md) for the full breakdown of what the installer does.


## Data providers

- `json` – `project/ui/public/items.json`
- `csv` – `project/ui/public/items.csv`
- `excel` – `project/ui/public/items.xlsx`
- `url` – pointer file `project/ui/public/items.url`
- `sheets` – Google Sheets config via `project/ui/public/sheets.json`
- `drive` – Google Drive config via `project/ui/public/drive.json`
- `api` – live Express/MySQL service (`project/api`). Optional Basic Auth enforced when `BASIC_AUTH_USER/PASS` and `VITE_TIMELINE_BASIC_AUTH_*` are set.

Force a provider at runtime with `?method=csv` or `VITE_TIMELINE_DATA_METHOD=csv`.

## Project layout

- `project/ui` – React app (Vite, MUI, Redux Toolkit, GSAP)
- `project/api` – Express server + MySQL migrations/seeders
- `docs/` – Developer & user guides (`docs/TimelineData.md`, etc.)
- `_notes/` – Design explorations, mockups, planning artifacts
- `examples/abdullah_v2/` – Example deployment bundle (api/ui/db seeds)

## Manual commands (if needed)

```
cd project/ui
npm install
npm run dev        # or npm run build / npm run preview

cd project/api
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## License

Released under the **Timeline Attribution License (TAL) v1.0** — see [LICENSE](./LISENCE).
