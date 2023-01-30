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
  clear(): Promise<boolean>;
}
export interface CacheOptions {
  namespace?: string;
  /** the maximum number of keys allowed in the cache  */
  maxSize?: number;
}
// ---------------------------------------------------------------
// Helpers
export function makeResponse(result: any, ttl: number) {
  return new Response(new Blob([JSON.stringify(result)]), {
    headers: { timestamp: `${Date.now()}`, ttl: `${ttl}` },
  });
}
export function isValidURL(str: string) {
  try {
    return !!new URL(str);
  } catch (e) {
    return false;
  }
}
export function isBrowser() {
  return typeof window !== "undefined";
}
const DEFAULT_NAMESPACE = "keyv-cache";
export function makeKey(_key: string, namespace: string = DEFAULT_NAMESPACE) {
  const key = decodeURIComponent(_key);
  return isValidURL(key) ? key : key + `:ns=${namespace}`;
}
// ---------------------------------------------------------------
// implementation
/**
 * @param namespace cache namespace
 */
export default class KeyvCache<T> implements CacheHandlers<T> {
  /** cache namespace */
  private ns: string;
  private maxSize: number;
  constructor(opt?: CacheOptions) {
    this.ns = opt?.namespace || DEFAULT_NAMESPACE;
    this.maxSize = opt?.maxSize && opt.maxSize <= 10000 ? opt.maxSize : 10000;
    this.runSanitization();
  }

  get caches() {
    if (!isBrowser()) {
      throw new ReferenceError("keyv-cache only works in the browser");
    }
    return window.caches;
  }

  private runSanitization() {
    const ONE_MINUTE = 1000 * 60;
    setInterval(() => this.sanitizeCache(), ONE_MINUTE);
  }

  async sanitizeCache() {
    const cache = await this.caches.open(this.ns);
    const keys = await cache.keys();
    if (keys.length >= this.maxSize) {
      await cache.delete(keys[0]);
    }
  }

  async set(key: string, value: T, ttl: milliseconds) {
    const cache = await this.caches.open(this.ns);
    await cache.put(makeKey(key, this.ns), makeResponse(value, ttl));
  }
  async get(_key: string) {
    const key = makeKey(_key, this.ns);
    const cache = await this.caches.open(this.ns);
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
  }
  async has(key: string) {
    return !!(await this.get(key));
  }
  async remove(key: string) {
    const cache = await this.caches.open(this.ns);
    return cache.delete(makeKey(key, this.ns));
  }
  async removePattern(pattern: string) {
    const cache = await this.caches.open(this.ns);
    const keys = await cache.keys();
    const keysToDelete = keys.filter((k) => k.url.includes(pattern));
    return Promise.all(keysToDelete.map((k) => cache.delete(k)));
  }
  async keys() {
    const cache = await this.caches.open(this.ns);
    return cache.keys().then((keys) => keys.map((k) => k.url));
  }
  clear() {
    return this.caches.delete(this.ns);
  }
}
