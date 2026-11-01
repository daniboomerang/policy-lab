import { describe, expectTypeOf, it } from "vitest";
import type { MandateCreate, MandateTerms, Verdict } from "./types";

describe("saifuro types", () => {
  it("names the eight documented verdict codes", () => {
    expectTypeOf<Verdict>().toEqualTypeOf<
      | "allow"
      | "review"
      | "deny_limit"
      | "deny_velocity"
      | "deny_category"
      | "deny_expired"
      | "deny_revoked"
      | "deny_no_mandate"
    >();
  });

  it("derives policy terms from MandateCreate without the agent", () => {
    expectTypeOf<MandateTerms>().toEqualTypeOf<Omit<MandateCreate, "agent">>();
    expectTypeOf<MandateTerms>().not.toHaveProperty("agent");
  });
});
