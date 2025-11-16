import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session-cookie", () => ({
  clearSessionCookie: vi.fn()
}));
vi.mock("@/lib/api-response", () => ({
  respond: vi.fn()
}));

import { clearSessionCookie } from "@/lib/session-cookie";
import { respond } from "@/lib/api-response";
import { POST } from "./route";

describe("POST /api/v1/auth/logout", () => {
  const successResponse = { ok: true } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(respond).mockReturnValue(successResponse);
  });

  it("clears the session cookie and responds with success", async () => {
    const response = await POST();

    expect(clearSessionCookie).toHaveBeenCalledTimes(1);
    expect(respond).toHaveBeenCalledWith("/api/v1/auth/logout", {
      data: { success: true }
    });
    expect(response).toBe(successResponse);
  });
});
