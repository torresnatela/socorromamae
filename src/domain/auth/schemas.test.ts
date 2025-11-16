import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./schemas";

describe("signupSchema", () => {
  it("requires LGPD acceptance", () => {
    const result = signupSchema.safeParse({
      email: "caregiver@example.com",
      password: "Password123",
      fullName: "Maria Caregiver",
      lgpdAccepted: false
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("defaults keepSignedIn to false", () => {
    const result = loginSchema.parse({
      email: "caregiver@example.com",
      password: "Password123"
    });

    expect(result.keepSignedIn).toBe(false);
  });
});
