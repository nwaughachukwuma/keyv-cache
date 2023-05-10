/**
 * @jest-environment jsdom
 */
import KeyvCache from "../lib/index.js";

let cache = KeyvCache();

beforeEach(() => {
  cache = KeyvCache();
});

beforeAll(() => {
  global.caches = window.caches;
});

describe("base test", () => {
  test("caches is defined", () => {
    expect(cache).not.toBeNull();
  });

  test("caches has set method", () => {
    expect(cache.set).not.toBeNull();
  });

  test("caches has get method", () => {
    expect(cache.get).not.toBeNull();
  });

  test("caches has 'has' method", () => {
    expect(cache.has).not.toBeNull();
  });

  test("caches has remove method", () => {
    expect(cache.remove).not.toBeNull();
  });

  test("caches has keys method", () => {
    expect(cache.keys).not.toBeNull();
  });

  test("caches has removePattern method", () => {
    expect(cache.removePattern).not.toBeNull();
  });

  test("caches has clear method", () => {
    expect(cache.clear).not.toBeNull();
  });
});
