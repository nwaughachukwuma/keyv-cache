/**
 * @jest-environment node
 */
import KeyvCache from "../lib/index.js";

describe("test in node.js environment", () => {
  test("must be invoked with 'new' keyword", async () => {
    expect(KeyvCache).toThrow(
      "Class constructor KeyvCache cannot be invoked without 'new'"
    );
  });
  test("attempting to access internal caches throws reference error in node environment", async () => {
    const caches = new KeyvCache();
    const scopedCaches = () => caches.caches;
    expect(scopedCaches).toThrow(ReferenceError);
  });
});
