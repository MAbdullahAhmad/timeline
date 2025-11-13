const envStore = {
  loaded: false,
  loading: null,
  values: {},
};

function parseEnv(text) {
  const result = {};
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .forEach((line) => {
      if (!line || line.startsWith('#')) return;
      const idx = line.indexOf('=');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      if (!key) return;
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    });
  return result;
}

async function fetchRuntimeEnv() {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    envStore.loaded = true;
    return envStore.values;
  }

  const envPath = window.__TIMELINE_ENV_PATH__ || '.env';
  try {
    const res = await fetch(envPath, { cache: 'no-store' });
    if (!res.ok) {
      envStore.loaded = true;
      return envStore.values;
    }
    const text = await res.text();
    envStore.values = parseEnv(text);
  } catch (err) {
    console.warn('runtimeEnv: unable to load .env file', err);
  } finally {
    envStore.loaded = true;
    envStore.loading = null;
  }
  return envStore.values;
}

export function getClientEnvVar(key) {
  if (Object.prototype.hasOwnProperty.call(envStore.values, key)) {
    return envStore.values[key];
  }
  return undefined;
}

export function getBuildEnvVar(key) {
  if (typeof import.meta !== 'undefined' && import.meta.env && key in import.meta.env) {
    return import.meta.env[key];
  }
  return undefined;
}

export function getRuntimeEnvVar(key, fallback = undefined) {
  const clientValue = getClientEnvVar(key);
  if (clientValue !== undefined) return clientValue;
  const buildValue = getBuildEnvVar(key);
  if (buildValue !== undefined) return buildValue;
  return fallback;
}

export async function ensureRuntimeEnvLoaded() {
  if (envStore.loaded) return envStore.values;
  if (!envStore.loading) envStore.loading = fetchRuntimeEnv();
  return envStore.loading;
}
