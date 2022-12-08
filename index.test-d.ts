import { expectType, expectAssignable } from "tsd";
import kvCache, { CacheHandlers } from "./index";

const cache = kvCache();
expectType<CacheHandlers<any>>(cache);
