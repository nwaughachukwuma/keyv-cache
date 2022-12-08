import { makeKey, makeResponse } from "./utils";

/** Cache duration in milliseconds */
type milliseconds = number;
export interface CacheHandlers<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttl: milliseconds): Promise<void>;
  has(key: string): Promise<boolean>;
  remove(key: string): Promise<void>;
}

/**
 * @param namespace cache namespace
 */
export default function kvCache<T = any>(
  namespace = "key-value-cache"
): CacheHandlers<T> {
  const caches = window.caches;

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
