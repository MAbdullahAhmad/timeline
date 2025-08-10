import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import { SnackbarProvider } from 'notistack';

const ESRouter = ({ routes=[] }) => {
  const generateRoutes = (prefix, routeGroup) => 
    Object.entries(routeGroup).map(([path, Component]) => (
      <Route key={prefix + path} path={prefix + path} element={<Component />} />
    ));

  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          {routes.map(({ prefix, routes }) => generateRoutes(prefix, routes))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default ESRouter;
