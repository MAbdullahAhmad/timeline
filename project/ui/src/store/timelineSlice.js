import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";

export const loadItems = createAsyncThunk("timeline/loadItems", async () => {
  const res = await fetch("/items.json");
  return await res.json();
});

const slice = createSlice({
  name: "timeline",
  initialState: { entities: {}, childrenMap: {}, roots: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadItems.fulfilled, (state, action) => {
      const entities = {};
      const childrenMap = {};
      const roots = [];

      for (const it of action.payload) {
        entities[it.id] = it;
        childrenMap[it.id] = Array.isArray(it.children) ? it.children : [];
        if (it.level === 0) roots.push(it.id);
      }

      state.entities = entities;
      state.childrenMap = childrenMap;
      state.roots = roots;
    });
  },
});

export default slice.reducer;

// selectors

export const selectItemById = (id) =>
  createSelector(
    (s) => s.timeline.entities,
    (entities) => entities[id]
  );

export const selectChildren = (id) =>
  createSelector(
    (s) => s.timeline.childrenMap[id] || [],
    (s) => s.timeline.entities,
    (childIds, entities) =>
      childIds.map((cid) => entities[cid]).filter(Boolean)
  );

export const selectRoots = createSelector(
  (s) => s.timeline.roots,
  (s) => s.timeline.entities,
  (rootIds, entities) =>
    rootIds.map((id) => entities[id]).filter(Boolean)
);
