/** API origin without /api/v1 — used for /uploads static files */
export function getApiOrigin() {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
  return base.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";
}

export function resolveUploadUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = getApiOrigin();
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
