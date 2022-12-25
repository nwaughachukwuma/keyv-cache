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
  test("throws reference error in node environment", async () => {
    try {
      new KeyvCache();
    } catch (error) {
      expect(error).toBeInstanceOf(ReferenceError);
    }
  });
});
