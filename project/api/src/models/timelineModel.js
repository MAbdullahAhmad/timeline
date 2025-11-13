import { query } from '../config/database.js';

const DATE_COLS = ['event_date'];

function mapRow(row) {
  const dateValue = row.date_label || formatDate(row.event_date);
  return {
    id: Number(row.id),
    title: row.title,
    category: row.category,
    categoryColor: row.category_color,
    note: row.note,
    img: row.img,
    img_link: row.img_link,
    desc: row.description,
    date: dateValue,
    level: row.level,
    children: [],
    parents: {}
  };
}

function formatDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().split('T')[0];
  try {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {
    return null;
  }
  return null;
}

async function fetchChildrenIds(id) {
  const rows = await query(
    `SELECT child_id
     FROM timeline_relationships
     WHERE parent_id = ?
     ORDER BY sort_order, child_id`,
    [id]
  );
  return rows.map((row) => String(row.child_id));
}

async function fetchParentsMap(id) {
  const rows = await query(
    `SELECT parent.id, parent.title
     FROM timeline_relationships rel
     INNER JOIN timeline_items parent ON parent.id = rel.parent_id
     WHERE rel.child_id = ?
     ORDER BY rel.sort_order, parent.id`,
    [id]
  );
  return rows.reduce((acc, row) => {
    acc[String(row.id)] = row.title;
    return acc;
  }, {});
}

export async function getRootItems() {
  const rows = await query(
    `SELECT * FROM timeline_items
     WHERE level = 0
     ORDER BY event_date, id`
  );

  const items = await Promise.all(
    rows.map(async (row) => {
      const item = mapRow(row);
      item.children = await fetchChildrenIds(row.id);
      return item;
    })
  );
  return items;
}

export async function getItemById(id) {
  const rows = await query('SELECT * FROM timeline_items WHERE id = ? LIMIT 1', [id]);
  if (!rows.length) return null;

  const item = mapRow(rows[0]);
  item.children = await fetchChildrenIds(id);
  item.parents = await fetchParentsMap(id);
  return item;
}

export async function getChildrenByParentId(parentId) {
  const rows = await query(
    `SELECT child.*
     FROM timeline_relationships rel
     INNER JOIN timeline_items child ON child.id = rel.child_id
     WHERE rel.parent_id = ?
     ORDER BY child.event_date, child.id`,
    [parentId]
  );

  const items = await Promise.all(
    rows.map(async (row) => {
      const item = mapRow(row);
      item.children = await fetchChildrenIds(row.id);
      item.parents = await fetchParentsMap(row.id);
      return item;
    })
  );
  return items;
}
