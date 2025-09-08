import fetch_file from "@/util/functions/fetch_file";
import JSONDataService from "./JSONDataService";
import CSVDataService from "./CSVDataService";
import XLSXDataService from "./XLSXDataService";

export default class GoogleDriveDataService {
  constructor(cfg_path = "/drive.json") {
    this.cfg_path = cfg_path;
    this.cfg = null;
    this.provider = null; // JSON/CSV/XLSX provider selected after check()
  }

  async check() {
    const cfg_text = await fetch_file(this.cfg_path);
    if (!cfg_text) return false;

    try { this.cfg = JSON.parse(cfg_text); } catch { return false; }

    const id = this.cfg.file_id || this._id_from_link(this.cfg.url);
    if (!id) return false;

    let ext = String(this.cfg.ext || "").toLowerCase();
    if (!ext && this.cfg.url) ext = this._ext_from_url(this.cfg.url);
    if (!["json", "csv", "xlsx"].includes(ext)) {
      console.error(`GoogleDriveDataService: unsupported or missing ext "${ext}"`);
      return false;
    }

    const kind = String(this.cfg.kind || "").toLowerCase(); // "file" | "sheet" (optional)
    const sheet = this.cfg.sheet || "Sheet1";
    const gid = this.cfg.gid;

    const url =
      kind === "sheet" || gid || this.cfg.sheet
        ? this._sheet_export_url(id, ext, sheet, gid)
        : this._file_download_url(id);

    if (!url) return false;

    this.provider =
      ext === "json" ? new JSONDataService(url)
      : ext === "csv" ? new CSVDataService(url)
      : new XLSXDataService(url);

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

  // ---------- helpers ----------
  _file_download_url(fileId) {
    // For regular Drive files (uploaded JSON/CSV/XLSX), public "Anyone with link" must be enabled
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  _sheet_export_url(id, ext, sheet, gid) {
    // Sheets export (public “Anyone with link”)
    if (ext === "csv") {
      if (gid) return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
      return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
    }
    if (ext === "xlsx") {
      return `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`;
    }
    // JSON export for Sheets is not directly supported; prefer CSV then parse.
    console.error('GoogleDriveDataService: use "csv" or "xlsx" for Google Sheets.');
    return null;
  }

  _id_from_link(link) {
    if (!link) return null;
    // Supports:
    // - https://drive.google.com/file/d/<ID>/view?usp=sharing
    // - https://drive.google.com/open?id=<ID>
    // - https://docs.google.com/spreadsheets/d/<ID>/edit#gid=...
    try {
      const u = new URL(link);
      if (u.hostname.includes("drive.google.com")) {
        const idFromOpen = u.searchParams.get("id");
        if (idFromOpen) return idFromOpen;
        const parts = u.pathname.split("/");
        const i = parts.findIndex((p) => p === "d");
        if (i >= 0 && parts[i + 1]) return parts[i + 1];
      }
      if (u.hostname.includes("docs.google.com")) {
        const parts = u.pathname.split("/");
        const i = parts.findIndex((p) => p === "d");
        if (i >= 0 && parts[i + 1]) return parts[i + 1];
      }
    } catch { /* ignore */ }
    return null;
  }

  _ext_from_url(url) {
    const q = url.split("?")[0];
    const seg = q.split("/").pop() || "";
    const ext = seg.includes(".") ? seg.split(".").pop().toLowerCase() : "";
    if (["json", "csv", "xlsx"].includes(ext)) return ext;
    return "";
  }
}
