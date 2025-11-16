import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/domain/auth/service", () => ({
  confirmPasswordReset: vi.fn()
}));
vi.mock("@/lib/api-response", () => ({
  respond: vi.fn()
}));
vi.mock("@/lib/route-error", () => ({
  handleRouteError: vi.fn()
}));

import { confirmPasswordReset } from "@/src/domain/auth/service";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { POST } from "./route";

const createRequest = (body: unknown): NextRequest =>
  ({
    json: vi.fn().mockResolvedValue(body)
  }) as unknown as NextRequest;

describe("POST /api/v1/auth/password-reset/confirm", () => {
  const successResponse = { ok: true } as any;
  const errorResponse = { ok: false } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(respond).mockReturnValue(successResponse);
    vi.mocked(handleRouteError).mockReturnValue(errorResponse);
  });

  it("confirms password reset with valid payload", async () => {
    const request = createRequest({
      accessToken: "access-token",
      password: "Password123"
    });

    const result = await POST(request);

    expect(confirmPasswordReset).toHaveBeenCalledWith({
      accessToken: "access-token",
      password: "Password123"
    });
    expect(respond).toHaveBeenCalledWith("/api/v1/auth/password-reset/confirm", {
      data: { success: true }
    });
    expect(result).toBe(successResponse);
  });

  it("routes validation failures through handleRouteError", async () => {
    const request = createRequest({
      accessToken: "bad",
      password: "short"
    });

    const result = await POST(request);

    expect(confirmPasswordReset).not.toHaveBeenCalled();
    expect(handleRouteError).toHaveBeenCalledWith(
      "/api/v1/auth/password-reset/confirm",
      expect.any(Error)
    );
    expect(result).toBe(errorResponse);
  });
});
