import { describe, expect, it } from "vitest";
import {
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  refreshSessionSchema,
  signupSchema
} from "./schemas";

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

describe("refreshSessionSchema", () => {
  it("defaults keepSignedIn to false", () => {
    const result = refreshSessionSchema.parse({});
    expect(result.keepSignedIn).toBe(false);
  });
});

describe("passwordResetRequestSchema", () => {
  it("validates email", () => {
    const parsed = passwordResetRequestSchema.safeParse({ email: "invalid" });
    expect(parsed.success).toBe(false);
  });
});

describe("passwordResetConfirmSchema", () => {
  it("validates token and password", () => {
    const parsed = passwordResetConfirmSchema.safeParse({
      accessToken: "token",
      password: "short"
    });
    expect(parsed.success).toBe(false);
  });
});
