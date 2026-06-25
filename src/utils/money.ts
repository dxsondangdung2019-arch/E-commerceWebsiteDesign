export function formatVND(value: number): string {
  return `₫${Math.round(value).toLocaleString("vi-VN")}`;
}

export function toNumberSafe(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}
