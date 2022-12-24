/**
 * @jest-environment node
 */
import keyvCache from "../lib/index.js";

describe("test in node.js environment", () => {
  test("expect caches to be null", async () => {
    const caches = keyvCache();
    expect(caches).toBeNull();
  });
});
