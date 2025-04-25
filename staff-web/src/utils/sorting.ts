export function applySort<T>(
  data: T[],
  key?: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  if (!key) return data;
  return [...data].sort((a, b) => {
    if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
    if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
    return 0;
  });
}
