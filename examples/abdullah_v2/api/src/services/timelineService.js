import { getRootItems, getItemById, getChildrenByParentId } from '../models/timelineModel.js';

export async function fetchRoots() {
  return await getRootItems();
}

export async function fetchItem(id) {
  return await getItemById(id);
}

export async function fetchChildren(id) {
  return await getChildrenByParentId(id);
}
