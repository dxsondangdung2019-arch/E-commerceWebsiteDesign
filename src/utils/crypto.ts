// Fake JWT helpers (browser-only: no Node.js Buffer)
function base64EncodeUtf8(str: string): string {
  // encodeURIComponent handles UTF-8; btoa expects binary string
  return btoa(unescape(encodeURIComponent(str)));
}

function base64DecodeUtf8(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

export function base64UrlEncode(input: string): string {
  const b64 = base64EncodeUtf8(input);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return base64DecodeUtf8(b64 + pad);
}

export function nowMs(): number {
  return Date.now();
}
