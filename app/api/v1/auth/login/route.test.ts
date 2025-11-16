import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/domain/auth/service", () => ({
  loginCaregiver: vi.fn()
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

import { loginCaregiver } from "@/src/domain/auth/service";
import { setSessionCookie } from "@/lib/session-cookie";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { POST } from "./route";

const createRequest = (body: unknown): NextRequest =>
  ({
    json: vi.fn().mockResolvedValue(body)
  }) as unknown as NextRequest;

describe("POST /api/v1/auth/login", () => {
  const successResponse = { ok: true } as any;
  const errorResponse = { ok: false } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(respond).mockReturnValue(successResponse);
    vi.mocked(handleRouteError).mockReturnValue(errorResponse);
  });

  it("logs caregivers in with valid credentials", async () => {
    const request = createRequest({
      email: "caregiver@example.com",
      password: "Password123",
      keepSignedIn: false
    });
    const serviceResult = {
      sessionToken: "session",
      maxAgeSeconds: 100,
      response: {
        caregiverId: "cg_1",
        sessionExpiresAt: new Date().toISOString(),
        subscription: { status: "trialing" }
      }
    };
    vi.mocked(loginCaregiver).mockResolvedValue(serviceResult);

    const result = await POST(request);

    expect(loginCaregiver).toHaveBeenCalledWith({
      email: "caregiver@example.com",
      password: "Password123",
      keepSignedIn: false
    });
    expect(setSessionCookie).toHaveBeenCalledWith("session", { maxAge: 100 });
    expect(respond).toHaveBeenCalledWith("/api/v1/auth/login", {
      data: serviceResult.response
    });
    expect(result).toBe(successResponse);
  });

  it("routes schema validation errors through handleRouteError", async () => {
    const request = createRequest({
      email: "not-an-email",
      password: "short"
    });

    const result = await POST(request);

    expect(loginCaregiver).not.toHaveBeenCalled();
    expect(handleRouteError).toHaveBeenCalledWith(
      "/api/v1/auth/login",
      expect.any(Error)
    );
    expect(result).toBe(errorResponse);
  });
});
