# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Timeline data providers

The Timeline UI can read data from local static files (`items.json`, `items.csv`, etc.) or from the new API server under `project/api`.

- Start the API: `npm run dev` inside `project/api` (after running migrations and configuring `.env.dev`).
- Force the UI to use the API provider via query string `?method=api` or env variable `VITE_TIMELINE_DATA_METHOD=api`.
- Optional: configure a custom API base URL with `VITE_TIMELINE_API_BASE` (defaults to `/api`).
- Optional: if the API requires HTTP Basic Auth, set `VITE_TIMELINE_BASIC_AUTH_USER` and `VITE_TIMELINE_BASIC_AUTH_PASS` in the deployed `.env` (values must match the API's `BASIC_AUTH_*`).
