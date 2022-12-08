// Description: A simple key-value cache using the browser cache API
// ---------------------------------------------------------------
// interface definition
/** Cache duration in milliseconds */
type milliseconds = number;
export interface CacheHandlers<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttl: milliseconds): Promise<void>;
  has(key: string): Promise<boolean>;
  remove(key: string): Promise<void>;
}
// ---------------------------------------------------------------
// Helpers
const makeResponse = (result: any, ttl: number) =>
  new Response(JSON.stringify(result), {
    headers: { timestamp: `${Date.now()}`, ttl: `${ttl}` },
  });
const isValidURL = (str: string) => {
  try {
    return !!new URL(str);
  } catch (e) {
    return false;
  }
};
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
export default function kvCache<T = any>(
  namespace = "key-value-cache"
): CacheHandlers<T> {
  const caches = window.caches;
  console.log("caches", caches);

  return {
    async set(key: string, value: T, ttl: number) {
      const cache = await caches.open(namespace);
      await cache.put(makeKey(key), makeResponse(value, ttl));
    },
    async get(_key: string) {
      const key = makeKey(_key);
      const cache = await caches.open(namespace);
      const response = await cache.match(key);
      if (!response?.ok) return null;

      const timestamp = response.headers.get("timestamp");
      const ttl = response.headers.get("ttl");
      if (!timestamp || !ttl) {
        await this.remove(key);
        return null;
      }

      const now = Date.now();
      if (+ttl + +timestamp < now) {
        await this.remove(key);
        return null;
      }

      return response.json();
    },
    async has(key: string) {
      const cache = await caches.open(namespace);
      const response = await cache.match(makeKey(key));
      return !!response?.ok;
    },
    async remove(key: string) {
      const cache = await caches.open(namespace);
      await cache.delete(key);
    },
  };
}
