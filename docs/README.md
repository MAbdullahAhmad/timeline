## Installation Helper

Use `scripts/install.bash` to provision a fresh copy of the repo with a ready-to-run UI build and helper scripts.

```
bash scripts/install.bash
```
> Tip: open the script on GitHub, copy its contents, and paste directly into a terminal if you prefer not to clone the repo first.
> Alternatively, run `curl -fsSL https://raw.githubusercontent.com/MAbdullahAhmad/timeline/main/scripts/install.bash | bash`.

The script will:

1. Create a `tmp/` directory in your current working directory and download the latest `main` branch archive.
2. Install dependencies for `project/ui` and run `npm run build` so the extracted copy already contains a production build.
3. Ask which timeline data provider you want (`json`, `csv`, `excel`, `url`, `sheets`, `drive`, or `api`). It prunes unused sample files from `project/ui/public` and writes matching values to `project/ui/.env` and `project/ui/public/.env` (including `VITE_TIMELINE_API_BASE`).
4. When `api` is selected, it can also wire up HTTP Basic Auth credentials for both the API (`project/api/.env`) and UI runtime env.
5. Generate the following helper scripts inside the extracted repo:
   - `setup.bash` – installs dependencies, runs migrations/seeders, and rebuilds the UI (idempotent, skip with `.setup_done`).
   - `run-api.bash` – launches the Express API (`npm run dev` under `project/api`).
   - `run-ui.bash` – launches Vite dev server (default) or `npm run preview` when called with `--preview`.

After the installer finishes:

```
cd /path/to/tmp/timeline-main
./setup.bash
./run-api.bash      # in terminal 1
./run-ui.bash       # in terminal 2
```

You can re-run the installer whenever you need a clean copy with a different data method or API configuration.
