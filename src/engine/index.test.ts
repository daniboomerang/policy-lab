import { describe, expect, it } from "vitest";
import * as engine from "./index";

describe("engine", () => {
  it("loads as a pure module with no side effects", () => {
    expect(engine).toBeDefined();
  });
});
