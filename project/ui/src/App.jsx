import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import ESRouter from "@core/util/components/ESRouter/ESRouter.jsx";
import routes from "@/routes";
import { loadItems } from "@/store/timelineSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadItems());
  }, [dispatch]);

  return <ESRouter routes={routes} />;
}
