import { expectType, expectAssignable } from "tsd";
import KeyvCache, { CacheHandlers } from "./index";

const cache = new KeyvCache<any>();
expectAssignable<CacheHandlers<any>>(cache);

if (cache) {
  // check the method signatures
  expectType<CacheHandlers<any>["get"]>(cache.get);
  expectType<CacheHandlers<any>["set"]>(cache.set);
  expectType<CacheHandlers<any>["has"]>(cache.has);
  expectType<CacheHandlers<any>["remove"]>(cache.remove);

  // check the methods return type signatures
  expectType<Promise<any>>(cache.get("key"));
  expectType<Promise<string>>(cache.set("key", "value", 1000));
  expectType<Promise<boolean>>(cache.has("key"));
  expectType<Promise<boolean>>(cache.remove("key"));
  expectType<Promise<boolean[]>>(cache.removePattern("key"));
  expectType<Promise<string[]>>(cache.keys());
}
