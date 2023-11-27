export function isBrowser() {
  return typeof window !== "undefined";
}

// Helpers
export function isValidURL(str: string) {
  try {
    return !!new URL(str);
  } catch (e) {
    return false;
  }
}

export function getCircularReplacer() {
  const seen = new WeakSet();
  return (_key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
}

export function makeKey(key: string, namespace: string = "keyv-cache") {
  const decodedKey = decodeURIComponent(key);
  return isValidURL(decodedKey)
    ? decodedKey
    : `${location.origin}?key=${decodedKey}&ns=${namespace}`;
}

export function isValidKey(keyRes: Response) {
  const now = Date.now();
  const timestamp = keyRes.headers.get("timestamp") || now;
  const ttl = keyRes.headers.get("ttl") || 0;
  return +ttl + +timestamp >= now;
}

export function makeResponse(result: any, ttl: number) {
  return new Response(JSON.stringify(result, getCircularReplacer()), {
    headers: { timestamp: `${Date.now()}`, ttl: `${ttl}` },
  });
}
