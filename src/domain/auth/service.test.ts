import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  createSupabaseAdminClient: vi.fn()
}));
vi.mock("jose", () => ({
  decodeJwt: vi.fn()
}));

import { createSupabaseAdminClient } from "@/lib/supabase";
import { confirmPasswordReset } from "./service";
import { decodeJwt } from "jose";
import { ApplicationError, UnauthorizedError } from "@/lib/errors";

const buildAdminClient = () => {
  const updateUserById = vi.fn().mockResolvedValue({ error: null });
  return {
    auth: {
      admin: {
        updateUserById
      }
    }
  };
};

describe("confirmPasswordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates caregiver password with decoded subject", async () => {
    const adminClient = buildAdminClient();
    vi.mocked(createSupabaseAdminClient).mockReturnValue(adminClient as any);
    vi.mocked(decodeJwt).mockReturnValue({ sub: "user-123" });

    await confirmPasswordReset({
      accessToken: "access-token",
      password: "Password123"
    });

    expect(adminClient.auth.admin.updateUserById).toHaveBeenCalledWith("user-123", {
      password: "Password123"
    });
  });

  it("throws UnauthorizedError when token decoding fails", async () => {
    vi.mocked(decodeJwt).mockImplementation(() => {
      throw new Error("bad token");
    });

    await expect(
      confirmPasswordReset({ accessToken: "invalid", password: "Password123" })
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedError when subject is missing", async () => {
    vi.mocked(decodeJwt).mockReturnValue({});

    await expect(
      confirmPasswordReset({ accessToken: "token", password: "Password123" })
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("throws ApplicationError when Supabase update fails", async () => {
    const adminClient = buildAdminClient();
    adminClient.auth.admin.updateUserById.mockResolvedValue({
      error: { message: "failed" }
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(adminClient as any);
    vi.mocked(decodeJwt).mockReturnValue({ sub: "user-123" });

    await expect(
      confirmPasswordReset({ accessToken: "token", password: "Password123" })
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
