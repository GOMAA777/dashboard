/** Must match `basePath` in next.config.ts if deploying to a subfolder */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!BASE_PATH) return normalized;
  if (normalized === "/") return `${BASE_PATH}/`;
  return `${BASE_PATH}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}
