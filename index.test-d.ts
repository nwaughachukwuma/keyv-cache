import { expectType, expectAssignable } from "tsd";
import keyvCache, { CacheHandlers } from "./index";

const cache = keyvCache();
expectType<CacheHandlers<any> | null>(cache);

if (cache) {
  expectType<CacheHandlers<any>>(cache);
  expectAssignable<CacheHandlers<any>>(cache);

  // check the method signatures
  expectType<CacheHandlers<any>["get"]>(cache.get);
  expectType<CacheHandlers<any>["set"]>(cache.set);
  expectType<CacheHandlers<any>["has"]>(cache.has);
  expectType<CacheHandlers<any>["remove"]>(cache.remove);

  // check the methods return type signatures
  expectType<Promise<any>>(cache.get("key"));
  expectType<Promise<void>>(cache.set("key", "value", 1000));
  expectType<Promise<boolean>>(cache.has("key"));
  expectType<Promise<boolean>>(cache.remove("key"));
}
