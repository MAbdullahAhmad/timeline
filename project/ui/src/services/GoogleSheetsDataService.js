import fetch_file from "@/util/functions/fetch_file";
import CSVDataService from "./CSVDataService";

export default class GoogleSheetsDataService {
  constructor(cfg_path = "/sheets.json") {
    this.cfg_path = cfg_path;
    this.cfg = null;

    // if mode=csv we'll delegate to CSVDataService
    this.delegate = null;

    // for mode=gviz we keep local indexes
    this.rows = null;
    this.entities = {};
    this.children_map = {};
    this.roots = [];
  }

  async check() {
    const cfg_text = await fetch_file(this.cfg_path);
    if (!cfg_text) return false;

    try {
      this.cfg = JSON.parse(cfg_text);
    } catch {
      console.error("GoogleSheetsDataService: invalid /sheets.json");
      return false;
    }

    const { spreadsheet_id, id, public_link, sheet = "Sheet1", mode = "csv" } = this.cfg;
    const { sid, gid } = this._extract_ids(public_link, spreadsheet_id || id);

    if (!sid) return false;

    if (String(mode).toLowerCase() === "csv") {
      // Prefer direct CSV export via gid; else fallback to GViz CSV
      const csv_url = gid
        ? `https://docs.google.com/spreadsheets/d/${sid}/export?format=csv&gid=${gid}`
        : `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;

      this.delegate = new CSVDataService(csv_url);
      return await this.delegate.check();
    }

    if (String(mode).toLowerCase() === "gviz") {
      const gviz = `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}`;
      const text = await fetch_file(gviz);
      if (!text) return false;

      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start < 0 || end < 0) return false;

      let obj;
      try { obj = JSON.parse(text.slice(start, end + 1)); } catch { return false; }
      const table = obj.table;
      if (!table?.rows?.length) return false;

      const headers = (table.cols || []).map((c, i) => (c.label || c.id || `col${i}`));
      const rows = table.rows.map((row) => headers.map((_, i) => (row.c?.[i]?.v ?? "")));
      this.rows = rows.map((r) => this._row_from_array(headers, r));
      this._index_rows();
      return true;
    }

    console.error(`GoogleSheetsDataService: unsupported mode "${mode}"`);
    return false;
  }

  // ------- public API -------
  async get_root_items(_opts = {}) {
    if (this.delegate) return this.delegate.get_root_items(_opts);
    return this.roots.map((id) => this.entities[id]).filter(Boolean);
  }
  async get_item_by_id(id, _opts = {}) {
    if (this.delegate) return this.delegate.get_item_by_id(id, _opts);
    return this.entities[String(id)] || null;
  }
  async get_children(id, _opts = {}) {
    if (this.delegate) return this.delegate.get_children(id, _opts);
    const ids = this.children_map[String(id)] || [];
    return ids.map((cid) => this.entities[cid]).filter(Boolean);
  }

  // ------- helpers -------
  _extract_ids(public_link, fallback_sid) {
    // public_link example:
    // https://docs.google.com/spreadsheets/d/<SID>/edit?gid=<GID>#gid=<GID>
    let sid = fallback_sid || null;
    let gid = null;

    if (public_link) {
      try {
        const u = new URL(public_link);
        const parts = u.pathname.split("/");
        const dIndex = parts.findIndex((p) => p === "d");
        if (dIndex >= 0 && parts[dIndex + 1]) sid = parts[dIndex + 1];

        gid = u.searchParams.get("gid") || (u.hash.includes("gid=") ? u.hash.split("gid=").pop() : null);
      } catch {
        // ignore parse errors; rely on fallback_sid
      }
    }
    return { sid, gid };
  }

  _row_from_array(headers, rowVals) {
    const obj = {};
    headers.forEach((h, i) => (obj[h.trim().toLowerCase()] = rowVals[i]));

    const id = String(obj.id ?? "").trim();
    const title = obj.title ?? "";
    const category = obj.category ?? "";
    const note = obj.note ?? "";
    const desc = obj.desc ?? obj.description ?? "";
    const date = obj.date ?? "";
    const img = obj.img ?? obj.image ?? "";
    const level = Number.isFinite(+obj.level) ? +obj.level : 0;

    let children = [];
    const raw = String(obj.children ?? "").trim();
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
}
