import fetch_file from "@/util/functions/fetch_file";

export default class JSONDataService {
  constructor(path = "/items.json") {
    this.path = path;
    this.data = null;
    this.entities = {};     // key: string id
    this.children_map = {}; // key: string id -> [string child ids]
    this.roots = [];        // [string ids]
  }

  async check() {
    const text = await fetch_file(this.path);
    if (!text) return false;
    try {
      this.data = JSON.parse(text);
      this._index_data();
      return true;
    } catch (e) {
      console.error("JSONDataService parse error:", e);
      return false;
    }
  }

  _id(v) { return String(v); }

  _index_data() {
    this.entities = {};
    this.children_map = {};
    this.roots = [];

    for (const it of this.data) {
      const id = this._id(it.id);
      this.entities[id] = it;
      const children = Array.isArray(it.children) ? it.children.map(this._id) : [];
      this.children_map[id] = children;
      if (it.level === 0) this.roots.push(id);
    }
  }

  async get_root_items() {
    return this.roots.map((id) => this.entities[id]).filter(Boolean);
  }

  async get_item_by_id(id) {
    return this.entities[this._id(id)] || null;
  }

  async get_children(id) {
    const key = this._id(id);
    let child_ids = this.children_map[key];

    // Fallback: read directly from entity if map is missing
    if (!child_ids || !child_ids.length) {
      const ent = this.entities[key];
      if (ent && Array.isArray(ent.children)) {
        child_ids = ent.children.map(this._id);
      } else {
        child_ids = [];
      }
    }

    return child_ids.map((cid) => this.entities[cid]).filter(Boolean);
  }
}
