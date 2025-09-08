import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ESRouter from "@core/util/components/ESRouter/ESRouter.jsx";
import routes from "@/routes";
import { loadRoots } from "@/store/timelineSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadRoots());
  }, [dispatch]);

  return <ESRouter routes={routes} />;
}
