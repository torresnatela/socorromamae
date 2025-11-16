import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/domain/auth/service", () => ({
  requestPasswordReset: vi.fn()
}));
vi.mock("@/lib/api-response", () => ({
  respond: vi.fn()
}));
vi.mock("@/lib/route-error", () => ({
  handleRouteError: vi.fn()
}));

import { requestPasswordReset } from "@/src/domain/auth/service";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { POST } from "./route";

const createRequest = (body: unknown): NextRequest =>
  ({
    json: vi.fn().mockResolvedValue(body)
  }) as unknown as NextRequest;

describe("POST /api/v1/auth/password-reset", () => {
  const successResponse = { ok: true } as any;
  const errorResponse = { ok: false } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(respond).mockReturnValue(successResponse);
    vi.mocked(handleRouteError).mockReturnValue(errorResponse);
  });

  it("requests password reset emails", async () => {
    const request = createRequest({ email: "caregiver@example.com" });

    const result = await POST(request);

    expect(requestPasswordReset).toHaveBeenCalledWith({
      email: "caregiver@example.com"
    });
    expect(respond).toHaveBeenCalledWith("/api/v1/auth/password-reset", {
      data: { success: true }
    });
    expect(result).toBe(successResponse);
  });

  it("returns validation errors via handleRouteError", async () => {
    const request = createRequest({ email: "invalid" });

    const result = await POST(request);

    expect(requestPasswordReset).not.toHaveBeenCalled();
    expect(handleRouteError).toHaveBeenCalledWith(
      "/api/v1/auth/password-reset",
      expect.any(Error)
    );
    expect(result).toBe(errorResponse);
  });
});
