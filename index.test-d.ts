import { expectType, expectAssignable } from "tsd";
import keyvCache, { CacheHandlers } from "./index";

const cache = keyvCache();
expectType<CacheHandlers<any> | null>(cache);
