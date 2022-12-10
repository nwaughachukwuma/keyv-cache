/**
 * @jest-environment node
 */
import keyvCache from "../lib/index.js";

describe("base test", () => {
  test("can set and check", async () => {
    const caches = keyvCache();
    expect(caches).toBeNull();
  });
});
