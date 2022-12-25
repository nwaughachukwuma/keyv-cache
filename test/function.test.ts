/**
 * @jest-environment jsdom
 */
import delay from "delay";
import keyvCache, { makeKey } from "../lib/index.js";
import CacheMock from "browser-cache-mock";

const cacheMock = new CacheMock();
beforeAll(() => {
  window.caches = {
    ...window.caches,
    ...cacheMock,
    open: async () => cacheMock,
  };
  global.window.caches = window.caches;
});

function getCache(namespace?: string) {
  const caches = keyvCache({ namespace });
  if (!caches) {
    throw new Error("caches is not defined");
  }
  return caches;
}

describe("functions test for the browser environment", () => {
  describe("functionality test", () => {
    test("can set item in the cache", async () => {
      const caches = getCache();
      await caches.set("myKey", "myValue", 3000); // Set a TTL of 1 second

      const hasKey = await caches.has("myKey");
      expect(hasKey).toBe(true);
    });

    test("can get cache item", async () => {
      const caches = getCache();
      await caches.set("myKey", "myValue", 3000); // Set a TTL of 1 second

      // get the wrong key
      const wrongValue = await caches.get("myKey2");
      expect(wrongValue).toBe(null);

      const value = await caches.get("myKey");
      expect(value).toBe("myValue");
    });

    test("cache item is automatically removed after TTL", async () => {
      const caches = getCache();
      await caches.set("myKey", "myValue", 1000); // Set a TTL of 1 second

      await delay(2000); // Wait 2 seconds

      const hasKey = await caches.has("myKey");
      expect(hasKey).toBe(false);
    });

    test("calling remove on cache item deletes it from the cache", async () => {
      const caches = getCache();
      await caches.set("myKey", "myValue", 3000); // Set a TTL of 3 seconds

      const hasKey1 = await caches.has("myKey");
      expect(hasKey1).toBe(true);

      await caches.remove("myKey");

      const hasKey2 = await caches.has("myKey");
      expect(hasKey2).toBe(false);
    });

    test("can remove cache item by pattern", async () => {
      const caches = getCache();
      await caches.set("myKey", "myValue", 3000);

      const hasKey = await caches.has("myKey");
      expect(hasKey).toBe(true);

      await caches.removePattern("myKey");

      const hasKey2 = await caches.has("myKey");
      expect(hasKey2).toBe(false);
    });

    test("can retrieve all namespaced keys in the cache", async () => {
      const caches = getCache();

      const key = makeKey("myKey");
      await caches.set(key, "myValue", 3000);
      const keys = await caches.keys();
      expect(keys).toContain(key);
    });

    test("can delete cache by namespace", async () => {
      const caches = getCache();
      await caches.set("myKey", "myValue", 3000);

      const hasKey = await caches.has("myKey");
      expect(hasKey).toBe(true);

      await caches.clear();

      const hasKey2 = await caches.has("myKey");
      expect(hasKey2).toBe(false);
    });
  });
});
