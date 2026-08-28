export function resolvePublicPath(path: string, base = import.meta.env.BASE_URL) {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
