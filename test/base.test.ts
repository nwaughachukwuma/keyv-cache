import keyvCache from "../lib/index.js";

function getCache() {
  const caches = keyvCache();
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

  test("caches has has method", () => {
    const caches = getCache();
    expect(caches.has).not.toBeNull();
  });

  test("caches has remove method", () => {
    const caches = getCache();
    expect(caches.remove).not.toBeNull();
  });
});
