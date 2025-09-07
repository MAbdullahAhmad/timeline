import { configureStore } from "@reduxjs/toolkit";
import timeline from "./timelineSlice";

export const store = configureStore({
  reducer: { timeline },
});
