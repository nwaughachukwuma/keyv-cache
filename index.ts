// Description: A simple key-value cache using the browser cache API
// ---------------------------------------------------------------
// Interfaces

/** Cache duration in milliseconds */
type milliseconds = number;
export interface CacheHandlers<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttl: milliseconds): Promise<void>;
  has(key: string): Promise<boolean>;
  remove(key: string): Promise<boolean>;
  removePattern(pattern: string): Promise<Array<boolean>>;
  keys(): Promise<string[]>;
}
export interface CacheOptions {
  namespace?: string;
}
// ---------------------------------------------------------------
// Helpers
function makeResponse(result: any, ttl: number) {
  return new Response(JSON.stringify(result), {
    headers: { timestamp: `${Date.now()}`, ttl: `${ttl}` },
  });
}
function isValidURL(str: string) {
  try {
    return !!new URL(str);
  } catch (e) {
    return false;
  }
}
function isBrowser() {
  return typeof window !== "undefined";
}
function makeKey(_key: string) {
  const key = decodeURIComponent(_key);
  if (isValidURL(key)) return key;

  const u = new URL(window.location.origin);
  u.searchParams.append("key", key);
  return u.href;
}
// ---------------------------------------------------------------
// implementation
/**
 * @param namespace cache namespace
 */
export default function KeyvCache<T = any>(
  opt?: CacheOptions
): CacheHandlers<T> | null {
  if (!isBrowser()) return null;

  const namespace = opt?.namespace || "keyv-cache";
  const caches = window.caches;

  return {
    async set(key: string, value: T, ttl: milliseconds) {
      const cache = await caches.open(namespace);
      await cache.put(makeKey(key), makeResponse(value, ttl));
    },
    async get(_key: string) {
      const key = makeKey(_key);
      const cache = await caches.open(namespace);
      const response = await cache.match(key);
      if (!response?.ok) return null;

      const now = Date.now();
      const timestamp = response.headers.get("timestamp") || now;
      const ttl = response.headers.get("ttl") || 0;
      if (+ttl + +timestamp < now) {
        await this.remove(key);
        return null;
      }

      return response.clone().json();
    },
    async has(key: string) {
      const cache = await caches.open(namespace);
      const response = await cache.match(makeKey(key));
      return !!response?.ok;
    },
    async remove(key: string) {
      const cache = await caches.open(namespace);
      return cache.delete(makeKey(key));
    },
    async removePattern(pattern: string) {
      const cache = await caches.open(namespace);
      const keys = await cache.keys();
      const keysToDelete = keys.filter((k) => k.url.includes(pattern));
      return Promise.all(keysToDelete.map((k) => cache.delete(k)));
    },
    async keys() {
      const cache = await caches.open(namespace);
      return cache.keys().then((keys) => keys.map((k) => k.url));
    },
  };
}
