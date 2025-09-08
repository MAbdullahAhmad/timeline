
/**
 * Fetch a file from local path or remote URL and return text content.
 * @param {string} path - Local path (e.g. "/items.json") or full URL.
 * @returns {Promise<string|null>} File text or null if error.
 */
export default async function fetch_file(path) {
  try {
    const res = await fetch(path, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error("fetch_file error:", err);
    return null;
  }
}
