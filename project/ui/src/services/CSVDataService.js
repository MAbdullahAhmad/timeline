import fetch_file from "@/util/functions/fetch_file";
import Papa from "papaparse";

export default class CSVDataService {
  constructor(path = "/items.csv") {
    this.path = path;
    this.rows = null;
    this.entities = {};
    this.children_map = {};
    this.roots = [];
  }

  async check() {
    const text = await fetch_file(this.path);
    if (!text) return false;

    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    if (parsed.errors?.length) {
      console.error("CSVDataService parse errors:", parsed.errors);
      return false;
    }

    this.rows = parsed.data.map((r) => this._normalize_row(r));
    this._index_rows();
    return true;
  }

  _normalize_row(r) {
    const id = String(r.id ?? "").trim();
    const title = r.title ?? "";
    const category = r.category ?? "";
    const note = r.note ?? "";
    const desc = r.desc ?? "";
    const date = r.date ?? "";
    const img = r.img ?? "";

    // children: accept JSON array string "[]", or pipe-delimited "a|b|c", or comma-delimited inside quotes
    let children = [];
    const rawChildren = (r.children ?? "").trim();
    if (rawChildren) {
      if (rawChildren.startsWith("[") && rawChildren.endsWith("]")) {
        try {
          const arr = JSON.parse(rawChildren);
          if (Array.isArray(arr)) children = arr.map((x) => String(x));
        } catch {
          children = [];
        }
      } else if (rawChildren.includes("|")) {
        children = rawChildren.split("|").map((x) => String(x).trim()).filter(Boolean);
      } else if (rawChildren.includes(",")) {
        // if someone supplied comma-separated ids (CSV-safe via quotes)
        children = rawChildren.split(",").map((x) => String(x).trim()).filter(Boolean);
      }
    }

    const level = Number.isFinite(+r.level) ? +r.level : 0;

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
