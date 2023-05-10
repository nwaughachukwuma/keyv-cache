// Interfaces
/** duration in milliseconds */
export type Milliseconds = number;
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
  return isValidURL(decodedKey) ? decodedKey : decodedKey + `:ns=${namespace}`;
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

export default function KeyvCache<T>(options?: CacheOptions) {
  return !isBrowser() || !window.caches || !window.caches.open
    ? new InMemoryCache<T>()
    : new BrowserCache<T>(options);
}

// Browser cache implementation
class BrowserCache<T> implements CacheHandlers<T> {
  private ns: string;
  public type = "browser";
  constructor(opt?: CacheOptions) {
    this.ns = opt?.namespace || "keyv-cache";
  }

  private get caches() {
    return window.caches;
  }

  async set(key: string, value: T, ttl: Milliseconds) {
    const cache = await this.caches.open(this.ns);
    await cache.put(makeKey(key, this.ns), makeResponse(value, ttl));
    return "OK";
  }
  async get(key: string) {
    const formattedKey = makeKey(key, this.ns);
    const cache = await this.caches.open(this.ns);
    const keyRes = await cache.match(formattedKey);
    if (!keyRes?.ok || !isValidKey(keyRes)) {
      await this.remove(formattedKey);
      return null;
    }

    return keyRes.clone().json();
  }
  async has(key: string) {
    const data = await this.get(key);
    return data != null;
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

// In memory cache implementation
class InMemoryCache<T> implements CacheHandlers<T> {
  private cache: Map<string, { value: T; expiry: number }> = new Map();
  public type = "in-memory";

  async set(key: string, value: T, ttl: Milliseconds): Promise<string> {
    this.cache.set(key, { value, expiry: Date.now() + ttl });
    return "OK";
  }

  async get(key: string): Promise<T | null> {
    const data = this.cache.get(key);
    if (data && data.expiry >= Date.now()) {
      return data.value;
    }
    this.cache.delete(key);
    return null;
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data != null;
  }

  async remove(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async removePattern(pattern: string): Promise<Array<boolean>> {
    const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
      key.includes(pattern)
    );
    return keysToDelete.map((key) => this.cache.delete(key));
  }

  async keys(): Promise<string[]> {
    return Array.from(this.cache.keys());
  }

  async clear(): Promise<boolean> {
    this.cache.clear();
    return true;
  }
}
