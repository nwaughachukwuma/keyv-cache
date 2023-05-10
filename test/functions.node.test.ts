/**
 * @jest-environment node
 */
import delay from "delay";
import KeyvCache from "../lib/index.js";

function getCache(namespace?: string) {
  const cache = KeyvCache({ namespace });
  if (cache.type !== "in-memory") {
    throw new Error("Cache is not in-memory cache");
  }
  return cache;
}

describe("test in node.js environment", () => {
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

    test("removing a cache item deletes it from the cache", async () => {
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

    test("can retrieve all keys in the cache", async () => {
      const cache = getCache();

      const key = "myKey";
      await cache.set(key, "myValue", 3000);
      const keys = await cache.keys();
      expect(keys).toHaveLength(1);
      expect(keys).toContain(key);
    });

    test("can clear the cache", async () => {
      const cache = getCache();
      await cache.set("myKey", "myValue", 3000);

      expect(await cache.has("myKey")).toBe(true);

      await cache.clear();
      expect(await cache.has("myKey")).toBe(false);
    });
  });
});
