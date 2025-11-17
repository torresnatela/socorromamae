import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session-cookie", () => ({
  readSessionCookie: vi.fn(),
  setSessionCookie: vi.fn()
}));
vi.mock("@/src/domain/auth/service", () => ({
  refreshSession: vi.fn()
}));
vi.mock("@/lib/api-response", () => ({
  respond: vi.fn()
}));
vi.mock("@/lib/route-error", () => ({
  handleRouteError: vi.fn()
}));

import { readSessionCookie, setSessionCookie } from "@/lib/session-cookie";
import { refreshSession } from "@/src/domain/auth/service";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { POST } from "./route";

const createRequest = (body: unknown): NextRequest =>
  ({
    json: vi.fn().mockResolvedValue(body)
  }) as unknown as NextRequest;

describe("POST /api/v1/auth/refresh", () => {
  const successResponse = { ok: true } as any;
  const errorResponse = { ok: false } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(respond).mockReturnValue(successResponse);
    vi.mocked(handleRouteError).mockReturnValue(errorResponse);
  });

  it("refreshes the session and resets the cookie", async () => {
    const request = createRequest({ keepSignedIn: true });
    vi.mocked(readSessionCookie).mockReturnValue("token");
    const refreshed = {
      sessionToken: "new-token",
      maxAgeSeconds: 3600,
      response: {
        caregiverId: "cg_1",
        sessionExpiresAt: new Date().toISOString(),
        subscription: { status: "trialing" }
      }
    };
    vi.mocked(refreshSession).mockResolvedValue(refreshed);

    const result = await POST(request);

    expect(refreshSession).toHaveBeenCalledWith("token", { keepSignedIn: true });
    expect(setSessionCookie).toHaveBeenCalledWith("new-token", { maxAge: 3600 });
    expect(respond).toHaveBeenCalledWith("/api/v1/auth/refresh", {
      data: refreshed.response
    });
    expect(result).toBe(successResponse);
  });

  it("handles missing cookies via UnauthorizedError", async () => {
    vi.mocked(readSessionCookie).mockReturnValue(null);
    const request = createRequest({ keepSignedIn: true });

    const result = await POST(request);

    expect(refreshSession).not.toHaveBeenCalled();
    expect(handleRouteError).toHaveBeenCalledWith(
      "/api/v1/auth/refresh",
      expect.any(Error)
    );
    expect(result).toBe(errorResponse);
  });

  it("rejects invalid payloads", async () => {
    vi.mocked(readSessionCookie).mockReturnValue("token");
    const request = createRequest({ keepSignedIn: "yes" });

    const result = await POST(request);

    expect(refreshSession).not.toHaveBeenCalled();
    expect(handleRouteError).toHaveBeenCalledWith(
      "/api/v1/auth/refresh",
      expect.any(Error)
    );
    expect(result).toBe(errorResponse);
  });
});
