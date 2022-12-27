/**
 * @jest-environment jsdom
 */
import KeyvCache from "../lib/index.js";

function getCache() {
  const caches = new KeyvCache();
  if (!caches) {
    throw new Error("caches is not defined");
  }
  return caches;
}

beforeAll(() => {
  global.caches = window.caches;
});

describe("base test", () => {
  test("caches is defined", () => {
    const caches = getCache();
    expect(caches).not.toBeNull();
  });

  test("caches has set method", () => {
    const caches = getCache();
    expect(caches.set).not.toBeNull();
  });

  test("caches has get method", () => {
    const caches = getCache();
    expect(caches.get).not.toBeNull();
  });

  test("caches has 'has' method", () => {
    const caches = getCache();
    expect(caches.has).not.toBeNull();
  });

  test("caches has remove method", () => {
    const caches = getCache();
    expect(caches.remove).not.toBeNull();
  });

  test("caches has keys method", () => {
    const caches = getCache();
    expect(caches.keys).not.toBeNull();
  });

  test("caches has removePattern method", () => {
    const caches = getCache();
    expect(caches.removePattern).not.toBeNull();
  });

  test("caches has clear method", () => {
    const caches = getCache();
    expect(caches.clear).not.toBeNull();
  });

  test("can access internal caches", async () => {
    const scopedCaches = () => getCache().caches;
    expect(scopedCaches).not.toThrow();
  });
});
