import JSONDataService from "./JSONDataService.js";
import CSVDataService from "./CSVDataService.js";
import XLSXDataService from "./XLSXDataService.js";
import URLDataService from "./URLDataService.js";
import GoogleSheetsDataService from "./GoogleSheetsDataService.js";
import GoogleDriveDataService from "./GoogleDriveDataService.js";

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
    };

    this.method = this._resolve_method(method);
    // console.log("Method", this.method);
    this.provider = null;
  }

  /**
   * Core Methods
   */

  // Initialize
  async init() {

    if (this.method && this.providers[this.method]) {
      this.provider = this.providers[this.method];
      const check = await this.provider.check();
      // console.log("Provider check", check);
      return;
    }

    // Fallback: probe providers
    const order = ["json", "csv", "xlsx", "url", "sheets", "drive"];
    for (const key of order) {
      const p = this.providers[key];
      if (p && (await p.check?.())) {
        this.provider = p;
        this.method = key;
        // console.log("Method", this.method);
        return;
      }
    }

    console.error("TimelineDataService: no data source available.");
    if (typeof window !== "undefined") alert("No data source available.");
  }

  _resolve_method(arg) {
    // 1. Argument
    if (arg) return String(arg).toLowerCase();

    // 2. URL Search Params
    if (typeof window !== "undefined") {
      const q = (new URLSearchParams(window.location.search)).get('method');
      if (q) return String(q).toLowerCase();
    }

    // 3. Environment Variable
    const env = import.meta?.env?.VITE_TIMELINE_DATA_METHOD;
    if(env) return String(env).toLowerCase()
      
    // 4. None (Fallback in this.init)
    return null;
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
