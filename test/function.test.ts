/**
 * @jest-environment jsdom
 */
import delay from "delay";
import KeyvCache, { makeKey } from "../lib/index.js";
import CacheMock from "browser-cache-mock";

const cacheMock = new CacheMock();
const cacheDeleteMock = jest.fn(async () => {
  const keys = await cacheMock.keys();
  await Promise.all(keys.map((k) => cacheMock.delete(k)));
  return true;
});
beforeAll(() => {
  window.caches = {
    ...window.caches,
    ...cacheMock,
    open: async () => cacheMock,
    delete: cacheDeleteMock,
  };
  global.window.caches = window.caches;
});

function getCache(namespace?: string) {
  const cache = new KeyvCache({ namespace });
  if (!cache) {
    throw new Error("cache is not defined");
  }
  return cache;
}

describe("functions test for browser environment", () => {
  describe("functionality test", () => {
    test("can set item in the cache", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000); // Set a TTL of 1 second

      const hasKey = await cache.has("myKey");
      expect(hasKey).toBe(true);
    });

    test("can get cache item", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000); // Set a TTL of 1 second

      // get the wrong key
      const wrongValue = await cache.get("myKey2");
      expect(wrongValue).toBe(null);

      const value = await cache.get("myKey");
      expect(value).toBe("myValue");
    });

    test("cache item is automatically removed after TTL", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 1000); // Set a TTL of 1 second

      await delay(2000); // Wait 2 seconds

      const hasKey = await cache.has("myKey");
      expect(hasKey).toBe(false);
    });

    test("calling remove on cache item deletes it from the cache", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000); // Set a TTL of 3 seconds

      const hasKey1 = await cache.has("myKey");
      expect(hasKey1).toBe(true);

      await cache.remove("myKey");

      const hasKey2 = await cache.has("myKey");
      expect(hasKey2).toBe(false);
    });

    test("can remove cache item by pattern", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000);

      const hasKey = await cache.has("myKey");
      expect(hasKey).toBe(true);

      await cache.removePattern("myKey");

      const hasKey2 = await cache.has("myKey");
      expect(hasKey2).toBe(false);
    });

    test("can retrieve all namespaced keys in the cache", async () => {
      const cache = getCache();

      const key = makeKey("myKey");
      await cache.set(key, "myValue", 3000);
      const keys = await cache.keys();
      expect(keys).toContain(key);
    });

    test("can delete cache by namespace", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000);

      const hasKey = await cache.has("myKey");
      expect(hasKey).toBe(true);

      await cache.clear();

      const hasKey2 = await cache.has("myKey");
      expect(hasKey2).toBe(false);
    });
  });

  describe("test namespacing", () => {
    test("cannot get item from another namespace", async () => {
      const cache = getCache("my-namespace");
      await cache.set("myKey", "myValue", 3000);

      // can get item in same cache
      const hasKey1 = await cache.has("myKey");
      expect(hasKey1).toBe(true);

      const cache2 = getCache("another-namespace");
      const hasKey2 = await cache2.has("myKey");
      expect(hasKey2).toBe(false);
    });
  });
});
