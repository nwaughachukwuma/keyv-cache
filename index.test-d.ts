import { expectType, expectAssignable } from "tsd";
import KeyvCache, { CacheHandlers } from "./index";

const cache = KeyvCache<any>();
expectAssignable<CacheHandlers<any>>(cache);

if (cache) {
  // check the method signatures
  expectAssignable<CacheHandlers<any>["get"]>(cache.get);
  expectAssignable<CacheHandlers<any>["set"]>(cache.set);
  expectAssignable<CacheHandlers<any>["has"]>(cache.has);
  expectAssignable<CacheHandlers<any>["remove"]>(cache.remove);
  expectAssignable<CacheHandlers<any>["removePattern"]>(cache.removePattern);
  expectAssignable<CacheHandlers<any>["keys"]>(cache.keys);
  expectAssignable<CacheHandlers<any>["clear"]>(cache.clear);

  // check the methods return type signatures
  expectType<Promise<any>>(cache.get("key"));
  expectType<Promise<string>>(cache.set("key", "value", 1000));
  expectType<Promise<boolean>>(cache.has("key"));
  expectType<Promise<boolean>>(cache.remove("key"));
  expectType<Promise<boolean[]>>(cache.removePattern("key"));
  expectType<Promise<string[]>>(cache.keys());
  expectType<Promise<boolean>>(cache.clear());
}
