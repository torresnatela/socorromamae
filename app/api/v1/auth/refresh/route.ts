import { NextRequest } from "next/server";
import { refreshSessionSchema } from "@/src/domain/auth/schemas";
import { refreshSession } from "@/src/domain/auth/service";
import { readSessionCookie, setSessionCookie } from "@/lib/session-cookie";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { UnauthorizedError, ValidationError } from "@/lib/errors";

const path = "/api/v1/auth/refresh";

export const POST = async (request: NextRequest) => {
  try {
    const token = readSessionCookie();
    if (!token) {
      throw new UnauthorizedError("No active session.");
    }

    const body = (await request.json().catch(() => ({}))) ?? {};
    const parsed = refreshSessionSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid refresh payload.", parsed.error.flatten());
    }

    const result = await refreshSession(token, parsed.data);
    setSessionCookie(result.sessionToken, { maxAge: result.maxAgeSeconds });

    return respond(path, {
      data: result.response
    });
  } catch (error) {
    return handleRouteError(path, error);
  }
};
