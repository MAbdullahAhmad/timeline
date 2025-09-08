// store/timelineSlice.js
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import tds from "@/services/TimelineDataService";

// thunks (on-demand, no full preload)
export const loadRoots = createAsyncThunk("timeline/loadRoots", async () => {
  const roots = await tds.get_root_items();
  return roots || [];
});

export const loadItemById = createAsyncThunk("timeline/loadItemById", async (id) => {
  const item = await tds.get_item_by_id(id);
  return item || null;
});

export const loadChildren = createAsyncThunk("timeline/loadChildren", async (id) => {
  const children = await tds.get_children(id);
  return { id, children: children || [] };
});

const initialState = {
  entities: {},
  childrenMap: {},
  roots: [],
};

const slice = createSlice({
  name: "timeline",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRoots.fulfilled, (state, action) => {
        const items = action.payload || [];
        state.roots = items.map((it) => it.id);
        for (const it of items) {
          state.entities[it.id] = it;
          state.childrenMap[it.id] = Array.isArray(it.children) ? it.children : [];
        }
      })
      .addCase(loadItemById.fulfilled, (state, action) => {
        const it = action.payload;
        if (!it) return;
        state.entities[it.id] = it;
        if (!(it.id in state.childrenMap)) {
          state.childrenMap[it.id] = Array.isArray(it.children) ? it.children : [];
        }
      })
      .addCase(loadChildren.fulfilled, (state, action) => {
        const { id, children } = action.payload || {};
        if (!id || !Array.isArray(children)) return;
        state.childrenMap[id] = children.map((c) => c.id);
        for (const it of children) state.entities[it.id] = it;
      })
    ;
  },
});

export default slice.reducer;

// selectors
export const selectItemById = (id) => {
  return createSelector(
    (s) => s.timeline.entities,
    (entities) => entities[id] || null
  );
}


export const selectChildren = (id) => {
  return createSelector(
    (s) => s.timeline.childrenMap[id] || [],
    (s) => s.timeline.entities,
    (childIds, entities) => childIds.map((cid) => entities[cid]).filter(Boolean)
  );
}
  

export const selectRoots = createSelector(
  (s) => s.timeline.roots,
  (s) => s.timeline.entities,
  (rootIds, entities) => rootIds.map((id) => entities[id]).filter(Boolean)
);
