import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session-cookie", () => ({
  readSessionCookie: vi.fn()
}));
vi.mock("@/lib/api-response", () => ({
  respond: vi.fn()
}));
vi.mock("@/lib/route-error", () => ({
  handleRouteError: vi.fn()
}));
vi.mock("@/src/domain/auth/service", () => ({
  getCurrentCaregiver: vi.fn()
}));

import { readSessionCookie } from "@/lib/session-cookie";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { getCurrentCaregiver } from "@/src/domain/auth/service";
import { GET } from "./route";

describe("GET /api/v1/auth/me", () => {
  const successResponse = { ok: true } as any;
  const errorResponse = { ok: false } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(respond).mockReturnValue(successResponse);
    vi.mocked(handleRouteError).mockReturnValue(errorResponse);
  });

  it("returns the caregiver profile when session cookie exists", async () => {
    vi.mocked(readSessionCookie).mockReturnValue("session-token");
    const profile = {
      caregiverId: "cg_1",
      sessionExpiresAt: new Date().toISOString(),
      subscription: { status: "trialing" }
    };
    vi.mocked(getCurrentCaregiver).mockResolvedValue(profile);

    const response = await GET();

    expect(getCurrentCaregiver).toHaveBeenCalledWith("session-token");
    expect(respond).toHaveBeenCalledWith("/api/v1/auth/me", { data: profile });
    expect(response).toBe(successResponse);
  });

  it("returns unauthorized via handleRouteError when session is missing", async () => {
    vi.mocked(readSessionCookie).mockReturnValue(null);

    const response = await GET();

    expect(getCurrentCaregiver).not.toHaveBeenCalled();
    expect(handleRouteError).toHaveBeenCalledWith(
      "/api/v1/auth/me",
      expect.any(Error)
    );
    expect(response).toBe(errorResponse);
  });
});
