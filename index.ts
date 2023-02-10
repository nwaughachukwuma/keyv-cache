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
  /** cache namespace */
  namespace?: string;
}
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};
// ---------------------------------------------------------------
// Helpers
export function makeResponse(result: any, ttl: number) {
  return new Response(JSON.stringify(result, getCircularReplacer()), {
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
class CacheWorker {
  constructor(protected ns: string) {}
  get caches() {
    if (!isBrowser()) {
      throw new ReferenceError("keyv-cache only works in the browser");
    }
    return window.caches;
  }
  makeKey(_key: string) {
    const key = decodeURIComponent(_key);
    return isValidURL(key) ? key : key + `:ns=${this.ns}`;
  }
  protected validKey(keyRes: Response) {
    const now = Date.now();
    const timestamp = keyRes.headers.get("timestamp") || now;
    const ttl = keyRes.headers.get("ttl") || 0;
    return +ttl + +timestamp >= now;
  }
}
// ---------------------------------------------------------------
// implementation
/**
 * @param namespace cache namespace
 */
export default class KeyvCache<T>
  extends CacheWorker
  implements CacheHandlers<T>
{
  protected ns: string;
  constructor(opt?: CacheOptions) {
    const ns = opt?.namespace || DEFAULT_NAMESPACE;
    super(ns);
    this.ns = ns;
  }

  async set(key: string, value: T, ttl: milliseconds) {
    const cache = await this.caches.open(this.ns);
    await cache.put(this.makeKey(key), makeResponse(value, ttl));
  }
  async get(_key: string) {
    const key = this.makeKey(_key);
    const cache = await this.caches.open(this.ns);
    const keyRes = await cache.match(key);
    if (!keyRes?.ok) return null;
    if (!this.validKey(keyRes)) {
      await this.remove(key);
      return null;
    }

    return keyRes.clone().json();
  }
  async has(key: string) {
    return !!(await this.get(key));
  }
  async remove(key: string) {
    const cache = await this.caches.open(this.ns);
    return cache.delete(this.makeKey(key));
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
