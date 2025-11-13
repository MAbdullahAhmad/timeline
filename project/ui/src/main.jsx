import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";

import theme from "@/theme";
import { store } from "@/store";
import App from "@/App";
import { ensureRuntimeEnvLoaded } from "@/config/runtimeEnv";

import "./main.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

async function bootstrap() {
  await ensureRuntimeEnvLoaded();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ThemeProvider>
  );
}

bootstrap().catch((err) => {
  console.error("Timeline bootstrap failed", err);
});
