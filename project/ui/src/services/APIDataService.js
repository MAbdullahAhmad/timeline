import { ensureRuntimeEnvLoaded, getRuntimeEnvVar } from "@/config/runtimeEnv";

export default class APIDataService {
  constructor(baseURL = null) {
    this.baseURL = baseURL ? String(baseURL).replace(/\/$/, '') : null;
    this.ready = false;
    this.authHeader = undefined;
  }

  async _ensureBaseURL() {
    if (!this.baseURL) {
      await ensureRuntimeEnvLoaded();
      const resolved = getRuntimeEnvVar("VITE_TIMELINE_API_BASE", "/api") || "/api";
      this.baseURL = String(resolved).replace(/\/$/, '');
    }
    return this.baseURL;
  }

  async _ensureAuthHeader() {
    if (this.authHeader !== undefined) return this.authHeader;
    await ensureRuntimeEnvLoaded();
    const user = getRuntimeEnvVar("VITE_TIMELINE_BASIC_AUTH_USER", "");
    const pass = getRuntimeEnvVar("VITE_TIMELINE_BASIC_AUTH_PASS", "");
    if (user && pass) {
      const encoded = this._encodeBasicCredentials(`${user}:${pass}`);
      this.authHeader = encoded ? `Basic ${encoded}` : null;
    } else {
      this.authHeader = null;
    }
    return this.authHeader;
  }

  _encodeBasicCredentials(raw) {
    if (typeof btoa === "function" && typeof TextEncoder !== "undefined") {
      const utf8 = new TextEncoder().encode(raw);
      let binary = "";
      utf8.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      return btoa(binary);
    }
    console.warn("APIDataService: unable to encode basic auth header (TextEncoder/btoa unavailable)");
    return null;
  }

  async _buildHeaders(base = {}) {
    const headers = { Accept: "application/json", ...base };
    const auth = await this._ensureAuthHeader();
    if (auth) headers.Authorization = auth;
    return headers;
  }

  async check() {
    try {
      const base = await this._ensureBaseURL();
      const headers = await this._buildHeaders();
      const res = await fetch(`${base}/health`, { cache: 'no-store', headers });
      this.ready = res.ok;
      return this.ready;
    } catch (err) {
      console.error('APIDataService health failed:', err);
      this.ready = false;
      return false;
    }
  }

  async get_root_items() {
    const data = await this._request('/timeline/roots');
    return this._normalizeList(data);
  }

  async get_item_by_id(id) {
    if (id == null) return null;
    const data = await this._request(`/timeline/items/${id}`);
    return this._normalize(data);
  }

  async get_children(id) {
    if (id == null) return [];
    const data = await this._request(`/timeline/items/${id}/children`);
    return this._normalizeList(data);
  }

  async _request(path) {
    const base = await this._ensureBaseURL();
    const url = `${base}${path}`;
    const headers = await this._buildHeaders();
    try {
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Request failed (${res.status})`);
      }
      return await res.json();
    } catch (err) {
      console.error('APIDataService request error:', err);
      return null;
    }
  }

  _normalize(item) {
    if (!item) return null;
    return {
      ...item,
      children: Array.isArray(item.children) ? item.children.map((cid) => String(cid)) : [],
      parents: item.parents && typeof item.parents === 'object' ? item.parents : {}
    };
  }

  _normalizeList(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => this._normalize(item)).filter(Boolean);
  }
}
