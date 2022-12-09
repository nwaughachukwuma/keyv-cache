import keyvCache from "../dist/index.js";

let caches: ReturnType<typeof keyvCache> = null;
function getCache() {
  if (!caches) {
    throw new Error("caches is not defined");
  }
  return caches;
}

beforeAll(() => {
  global.caches = window.caches;
  caches = keyvCache();
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
