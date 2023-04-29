// Interfaces
/** duration in milliseconds */
type Milliseconds = number;
export interface CacheHandlers<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl: Milliseconds): Promise<string>;
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
// Helpers
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
function getCircularReplacer() {
  const seen = new WeakSet();
  return (_key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
}
// Implementation
class CacheWorker {
  constructor(protected ns: string) {}
  get caches() {
    if (!isBrowser()) {
      throw new ReferenceError("keyv-cache only works in the browser");
    }
    return window.caches;
  }
  makeKey(key: string) {
    const decodedKey = decodeURIComponent(key);
    return isValidURL(decodedKey) ? decodedKey : decodedKey + `:ns=${this.ns}`;
  }
  protected isValidKey(keyRes: Response) {
    const now = Date.now();
    const timestamp = keyRes.headers.get("timestamp") || now;
    const ttl = keyRes.headers.get("ttl") || 0;
    return +ttl + +timestamp >= now;
  }
  protected makeResponse(result: any, ttl: number) {
    return new Response(JSON.stringify(result, getCircularReplacer()), {
      headers: { timestamp: `${Date.now()}`, ttl: `${ttl}` },
    });
  }
}
export default class KeyvCache<T>
  extends CacheWorker
  implements CacheHandlers<T>
{
  constructor(opt?: CacheOptions) {
    const ns = opt?.namespace || "keyv-cache";
    super(ns);
    this.ns = ns;
  }

  async set(key: string, value: T, ttl: Milliseconds) {
    const cache = await this.caches.open(this.ns);
    await cache.put(this.makeKey(key), this.makeResponse(value, ttl));
    return "OK";
  }
  async get(key: string) {
    const formattedKey = this.makeKey(key);
    const cache = await this.caches.open(this.ns);
    const keyRes = await cache.match(formattedKey);
    if (!keyRes?.ok || !this.isValidKey(keyRes)) {
      await this.remove(formattedKey);
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
