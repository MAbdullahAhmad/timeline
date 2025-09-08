// services/URLDataService.js
import fetch_file from "@/util/functions/fetch_file";
import JSONDataService from "./JSONDataService";
import CSVDataService from "./CSVDataService";
import XLSXDataService from "./XLSXDataService";

export default class URLDataService {
  constructor(path = "/items.url") {
    this.path = path;      // text file containing a single URL
    this.provider = null;  // delegated concrete provider
  }

  async check() {
    const text = await fetch_file(this.path);
    if (!text) return false;

    const url = text.trim();
    if (!url) return false;

    const type = this._infer_type(url);
    if (type === "json") this.provider = new JSONDataService(url);
    else if (type === "csv") this.provider = new CSVDataService(url);
    else if (type === "xlsx") this.provider = new XLSXDataService(url);
    else {
      const msg = `URLDataService: unsupported file extension for "${url}"`;
      console.error(msg);
      throw new Error(msg);
    }

    return await this.provider.check();
  }

  async get_root_items(opts = {}) {
    if (!this.provider && !(await this.check())) return [];
    return this.provider.get_root_items(opts);
  }

  async get_item_by_id(id, opts = {}) {
    if (!this.provider && !(await this.check())) return null;
    return this.provider.get_item_by_id(id, opts);
  }

  async get_children(id, opts = {}) {
    if (!this.provider && !(await this.check())) return [];
    return this.provider.get_children(id, opts);
  }

  _infer_type(rawUrl) {
    let u;
    try {
      u = new URL(rawUrl, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    } catch {
      return null;
    }
    const pathname = u.pathname || "";
    const ext = pathname.split(".").pop()?.toLowerCase() || "";
    if (ext === "json") return "json";
    if (ext === "csv") return "csv";
    if (ext === "xlsx") return "xlsx";
    return null;
  }
}
