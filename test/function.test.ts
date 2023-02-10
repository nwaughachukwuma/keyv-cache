/**
 * @jest-environment jsdom
 */
import delay from "delay";
import KeyvCache from "../lib/index.js";
import CacheMock from "browser-cache-mock";

const cacheMock = new CacheMock();
const cacheDeleteMock = jest.fn(async (namespace) => {
  const keys = await cacheMock.keys();
  const nsKeys = keys.filter((k) => k.url.includes(namespace));
  await Promise.all(nsKeys.map((k) => cacheMock.delete(k)));

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

    test("can set item using plain string as key", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000);
      expect(await cache.has("myKey")).toBe(true);
    });

    test("can set item using url as key", async () => {
      const cache = getCache();

      const key = "http://localhost:3000/display?key=myKey";
      await cache.set(key, "myValue", 3000);
      expect(await cache.has(key)).toBe(true);
    });

    test("can get cache item", async () => {
      const cache = getCache();
      const val = { v: "myValue" };
      await cache.set("myKey", val, 3000); // Set a TTL of 3 second

      // get the wrong key
      const wrongValue = await cache.get("myKey2");
      expect(wrongValue).toBe(null);

      const value = await cache.get("myKey");
      expect(value).toMatchObject(val);
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

      expect(await cache.has("myKey")).toBe(true);

      await cache.remove("myKey");

      expect(await cache.has("myKey")).toBe(false);
    });

    test("can remove cache item by pattern", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000);

      expect(await cache.has("myKey")).toBe(true);

      await cache.removePattern("myK");

      expect(await cache.has("myKey")).toBe(false);
    });

    test("can retrieve all namespaced keys in the cache", async () => {
      const cache = getCache();

      const key = "myKey";
      await cache.set(key, "myValue", 3000);
      const keys = await cache.keys();
      expect(keys).toHaveLength(1);
      expect(keys).toContain(cache.makeKey(key));
    });

    test("can delete a cache namespace", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000);

      expect(await cache.has("myKey")).toBe(true);

      await cache.clear();
      expect(await cache.has("myKey")).toBe(false);
    });
  });

  describe("test namespacing", () => {
    test("cannot get item from another namespace", async () => {
      const cache = getCache("my-namespace");
      await cache.set("myKey", "myValue", 3000);

      expect(await cache.has("myKey")).toBe(true);

      const cache2 = getCache("another-namespace");
      expect(await cache2.has("myKey")).toBe(false);
    });

    test("cannot delete item on another namespace", async () => {
      const cache = getCache("my-namespace");
      await cache.set("myKey", "myValue", 3000);

      expect(await cache.has("myKey")).toBe(true);

      const cache2 = getCache("another-namespace");
      await cache2.remove("myKey");

      expect(await cache.has("myKey")).toBe(true);
    });

    test("clearing one namespace doesn't affect others", async () => {
      const cache = getCache("my-namespace");
      await cache.set("myKey", "myValue", 3000);

      const cache2 = getCache("another-namespace");
      await cache2.set("otherKey", "otherValue", 3000);

      await cache.clear();

      expect(await cache.has("myKey")).toBe(false);
      expect(await cache2.has("otherKey")).toBe(true);
    });
  });
});
