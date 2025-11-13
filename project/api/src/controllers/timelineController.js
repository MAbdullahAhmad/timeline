import { fetchRoots, fetchItem, fetchChildren } from '../services/timelineService.js';

export async function getHealth(req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}

export async function getRootsHandler(req, res, next) {
  try {
    const items = await fetchRoots();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getItemHandler(req, res, next) {
  try {
    const { id } = req.params;
    const item = await fetchItem(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function getChildrenHandler(req, res, next) {
  try {
    const { id } = req.params;
    const items = await fetchChildren(id);
    res.json(items);
  } catch (err) {
    next(err);
  }
}
