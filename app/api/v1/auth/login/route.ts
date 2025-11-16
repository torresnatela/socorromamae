import { NextRequest } from "next/server";
import { loginSchema } from "@/src/domain/auth/schemas";
import { loginCaregiver } from "@/src/domain/auth/service";
import { ValidationError } from "@/lib/errors";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { setSessionCookie } from "@/lib/session-cookie";

const path = "/api/v1/auth/login";

export const POST = async (request: NextRequest) => {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      throw new ValidationError("Invalid credentials payload.", parsed.error.flatten());
    }

    const result = await loginCaregiver(parsed.data);
    setSessionCookie(result.sessionToken, { maxAge: result.maxAgeSeconds });

    return respond(path, {
      data: result.response
    });
  } catch (error) {
    return handleRouteError(path, error);
  }
};
