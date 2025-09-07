import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";

import theme from "@/theme";
import { store } from "@/store";
import App from "@/App";

import "./main.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </ThemeProvider>
);
