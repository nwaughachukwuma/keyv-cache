/**
 * Browser cache implementation
 */
import type { CacheHandlers, CacheOptions, Milliseconds } from "./types";
import { isValidKey, makeKey, makeResponse } from "./utils";

export class BrowserCache<T> implements CacheHandlers<T> {
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
