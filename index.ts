import { isBrowser } from "./utils";
import type { CacheHandlers, CacheOptions } from "./types";
import { InMemoryCache } from "./inmemoryCache";
import { BrowserCache } from "./browserCache";

export type * from "./types";
export * from "./utils";
export default function KeyvCache<T = any>(
  options?: CacheOptions
): CacheHandlers<T> {
  return !isBrowser() || !window.caches || !window.caches.open
    ? new InMemoryCache<T>()
    : new BrowserCache<T>(options);
}
