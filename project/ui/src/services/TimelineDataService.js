import JSONDataService from "./JSONDataService.js";
import CSVDataService from "./CSVDataService.js";
import XLSXDataService from "./XLSXDataService.js";
import URLDataService from "./URLDataService.js";
import GoogleSheetsDataService from "./GoogleSheetsDataService.js";
import GoogleDriveDataService from "./GoogleDriveDataService.js";
import APIDataService from "./APIDataService.js";
import {
  ensureRuntimeEnvLoaded,
  getClientEnvVar,
  getBuildEnvVar,
} from "@/config/runtimeEnv";

class TimelineDataService {
  
  /**
   * Constructor
   */
  constructor(method = null) {
    this.providers = {
      json: new JSONDataService(),
      csv: new CSVDataService(),
      excel: new XLSXDataService(),
      url: new URLDataService(),
      sheets: new GoogleSheetsDataService(),
      drive: new GoogleDriveDataService(),
      api: new APIDataService(),
    };

    this.explicitMethod = this._normalize_method_name(method);
    this.method = null;
    this.provider = null;
    this.methodResolved = false;
    this.methodSource = null;
  }

  /**
   * Core Methods
   */

  // Initialize
  async init() {
    if (this.provider) return;

    const preferred = await this._resolve_method();
    if (preferred && this.providers[preferred]) {
      const candidate = this.providers[preferred];
      if (candidate && (await candidate.check?.())) {
        this.provider = candidate;
        this.method = preferred;
        return;
      }
    }

    const order = ["json", "csv", "excel", "url", "sheets", "drive", "api"];
    for (const key of order) {
      if (key === preferred) continue;
      const p = this.providers[key];
      if (p && (await p.check?.())) {
        this.provider = p;
        this.method = key;
        return;
      }
    }

    console.error("TimelineDataService: no data source available.");
    if (typeof window !== "undefined") alert("No data source available.");
  }

  async _resolve_method(arg) {
    if (this.methodResolved) return this.method;
    this.methodResolved = true;

    const fromArg = this._normalize_method_name(arg ?? this.explicitMethod);
    if (fromArg) {
      this.method = fromArg;
      this.methodSource = "argument";
      return this.method;
    }

    await ensureRuntimeEnvLoaded();
    const clientMethod = this._normalize_method_name(
      getClientEnvVar("VITE_TIMELINE_DATA_METHOD")
    );
    if (clientMethod) {
      this.method = clientMethod;
      this.methodSource = "client-env";
      return this.method;
    }

    const buildMethod = this._normalize_method_name(
      getBuildEnvVar("VITE_TIMELINE_DATA_METHOD")
    );
    if (buildMethod) {
      this.method = buildMethod;
      this.methodSource = "build-env";
      return this.method;
    }

    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("method");
      const fromQuery = this._normalize_method_name(q);
      if (fromQuery) {
        this.method = fromQuery;
        this.methodSource = "query";
        return this.method;
      }
    }

    this.method = null;
    this.methodSource = null;
    return null;
  }

  _normalize_method_name(value) {
    if (!value) return null;
    const normalized = String(value).toLowerCase();
    if (normalized === "xlsx") return "excel";
    return normalized;
  }

  /**
   * Getters
   */
  async get_root_items(opts = {}) {
    if (!this.provider) await this.init();
    return (await this.provider?.get_root_items?.(opts)) ?? [];
  }

  async get_item_by_id(id, opts = {}) {
    if (!this.provider) await this.init();
    return (await this.provider?.get_item_by_id?.(id, opts)) ?? null;
  }

  async get_children(id, opts = {}) {
    if (!this.provider) await this.init();
    return (await this.provider?.get_children?.(id, opts)) ?? [];
  }
}

const tds = new TimelineDataService();
if (typeof window !== "undefined") window.tds = tds;

export default tds;
export { TimelineDataService };
