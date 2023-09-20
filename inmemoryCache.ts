/**
 * In-memory cache implementation
 */
import type { CacheHandlers, Milliseconds } from "./types";

export class InMemoryCache<T> implements CacheHandlers<T> {
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
