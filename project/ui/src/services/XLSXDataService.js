import * as XLSX from "xlsx";

export default class XLSXDataService {
  constructor(path = "/items.xlsx") {
    this.path = path;
    this.rows = null;
    this.entities = {};
    this.children_map = {};
    this.roots = [];
  }

  async check() {
    const res = await fetch(this.path, { credentials: "same-origin", cache: "no-store" });
    if (!res?.ok) return false;

    const buf = await res.arrayBuffer().catch(() => null);
    if (!buf) return false;

    let wb;
    try {
      wb = XLSX.read(buf, { type: "array" });
    } catch (e) {
      console.error("XLSXDataService parse error:", e);
      return false;
    }
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    this.rows = data.map((r) => this._normalize_row(r));
    this._index_rows();
    return true;
  }

  _normalize_row(r) {
    const id = String(r.id ?? r.ID ?? "").trim();
    const title = r.title ?? r.Title ?? "";
    const category = r.category ?? r.Category ?? "";
    const note = r.note ?? r.Note ?? "";
    const desc = r.desc ?? r.description ?? r.Desc ?? "";
    const date = r.date ?? r.Date ?? "";
    const img = r.img ?? r.image ?? r.Img ?? "";

    let children = [];
    const raw = String(r.children ?? r.Children ?? "").trim();
    if (raw) {
      if (raw.startsWith("[") && raw.endsWith("]")) {
        try {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) children = arr.map((x) => String(x));
        } catch { /* ignore */ }
      } else if (raw.includes("|")) {
        children = raw.split("|").map((x) => x.trim()).filter(Boolean);
      } else if (raw.includes(",")) {
        children = raw.split(",").map((x) => x.trim()).filter(Boolean);
      }
    }

    const levelRaw = r.level ?? r.Level ?? 0;
    const level = Number.isFinite(+levelRaw) ? +levelRaw : 0;

    return { id, title, category, note, desc, date, img, children, level };
  }

  _index_rows() {
    this.entities = {};
    this.children_map = {};
    this.roots = [];

    for (const it of this.rows) {
      this.entities[it.id] = it;
      this.children_map[it.id] = Array.isArray(it.children) ? it.children : [];
      if (it.level === 0) this.roots.push(it.id);
    }
  }

  async get_root_items(_opts = {}) {
    return this.roots.map((id) => this.entities[id]).filter(Boolean);
  }

  async get_item_by_id(id, _opts = {}) {
    return this.entities[String(id)] || null;
  }

  async get_children(id, _opts = {}) {
    const child_ids = this.children_map[String(id)] || [];
    return child_ids.map((cid) => this.entities[cid]).filter(Boolean);
  }
}
