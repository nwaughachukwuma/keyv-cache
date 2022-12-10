/**
 * @jest-environment jsdom
 */
import delay from "delay";
import keyvCache from "../lib/index.js";
import CacheMock from "browser-cache-mock";

const cacheMock = new CacheMock();
beforeAll(() => {
  window.caches = {
    ...window.caches,
    open: async () => cacheMock,
    ...cacheMock,
  };
  global.window.caches = window.caches;
});

function getCache() {
  const caches = keyvCache();
  if (!caches) {
    throw new Error("caches is not defined");
  }
  return caches;
}

describe("base test", () => {
  test("can set and check", async () => {
    const caches = getCache();
    await caches.set("myKey", "myValue", 1000); // Set a TTL of 1 second

    const hasKey = await caches.has("myKey");
    expect(hasKey).toBe(true);
  });

  test("can set and get", async () => {
    const caches = getCache();
    await caches.set("myKey", "myValue", 1000); // Set a TTL of 1 second

    // get the wrong key
    const wrongValue = await caches.get("myKey2");
    expect(wrongValue).toBe(null);

    const value = await caches.get("myKey");
    expect(value).toBe("myValue");
  });

  test("can set and get after a delay", async () => {
    const caches = getCache();
    await caches.set("myKey", "myValue", 1000); // Set a TTL of 1 second

    await delay(2000); // Wait 2 seconds

    const value = await caches.get("myKey");
    expect(value).toBe(null);
  });

  test("can set, get and remove", async () => {
    const caches = getCache();
    await caches.set("myKey", "myValue", 5000); // Set a TTL of 5 seconds

    await delay(2000); // Wait 2 seconds
    const value = await caches.get("myKey");
    expect(value).toBe("myValue");

    await caches.remove("myKey");

    const hasKey = await caches.has("myKey");
    expect(hasKey).toBe(false);
  });
});
