import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/domain/auth/service", () => ({
  signupCaregiver: vi.fn()
}));
vi.mock("@/lib/session-cookie", () => ({
  setSessionCookie: vi.fn()
}));
vi.mock("@/lib/api-response", () => ({
  respond: vi.fn()
}));
vi.mock("@/lib/route-error", () => ({
  handleRouteError: vi.fn()
}));

import { signupCaregiver } from "@/src/domain/auth/service";
import { setSessionCookie } from "@/lib/session-cookie";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { POST } from "./route";

const createRequest = (body: unknown): NextRequest =>
  ({
    json: vi.fn().mockResolvedValue(body)
  }) as unknown as NextRequest;

describe("POST /api/v1/auth/signup", () => {
  const successResponse = { ok: true } as any;
  const errorResponse = { ok: false } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(respond).mockReturnValue(successResponse);
    vi.mocked(handleRouteError).mockReturnValue(errorResponse);
  });

  it("creates a caregiver session when payload is valid", async () => {
    const request = createRequest({
      email: "caregiver@example.com",
      password: "Password123",
      fullName: "Maria Caregiver",
      lgpdAccepted: true,
      keepSignedIn: true
    });
    const authResponse = {
      sessionToken: "jwt",
      maxAgeSeconds: 123,
      response: {
        caregiverId: "cg_123",
        sessionExpiresAt: new Date().toISOString(),
        subscription: { status: "trialing" }
      }
    };
    vi.mocked(signupCaregiver).mockResolvedValue(authResponse);

    const result = await POST(request);

    expect(signupCaregiver).toHaveBeenCalledWith({
      email: "caregiver@example.com",
      password: "Password123",
      fullName: "Maria Caregiver",
      lgpdAccepted: true,
      keepSignedIn: true
    });
    expect(setSessionCookie).toHaveBeenCalledWith("jwt", { maxAge: 123 });
    expect(respond).toHaveBeenCalledWith("/api/v1/auth/signup", {
      data: authResponse.response,
      status: 201
    });
    expect(result).toBe(successResponse);
  });

  it("delegates to handleRouteError when validation fails", async () => {
    const request = createRequest({
      email: "caregiver@example.com",
      password: "Password123",
      fullName: "Maria Caregiver",
      lgpdAccepted: false
    });

    const result = await POST(request);

    expect(signupCaregiver).not.toHaveBeenCalled();
    expect(handleRouteError).toHaveBeenCalledWith(
      "/api/v1/auth/signup",
      expect.any(Error)
    );
    expect(result).toBe(errorResponse);
  });
});
