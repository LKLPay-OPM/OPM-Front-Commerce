export function createQueryString(params) {
  return Object.entries(params)
    .filter(([_, value]) => value != "" && typeof value !== "undefined" && value != null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}
