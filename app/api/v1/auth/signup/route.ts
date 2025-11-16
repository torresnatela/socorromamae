import { NextRequest } from "next/server";
import { signupSchema } from "@/src/domain/auth/schemas";
import { signupCaregiver } from "@/src/domain/auth/service";
import { ValidationError } from "@/src/lib/errors";
import { handleRouteError } from "@/src/lib/route-error";
import { respond } from "@/src/lib/api-response";
import { setSessionCookie } from "@/src/lib/session-cookie";

const path = "/api/v1/auth/signup";

export const POST = async (request: NextRequest) => {
  try {
    const json = await request.json();
    const parsed = signupSchema.safeParse(json);

    if (!parsed.success) {
      throw new ValidationError("Invalid payload.", parsed.error.flatten());
    }

    const result = await signupCaregiver(parsed.data);
    setSessionCookie(result.sessionToken, { maxAge: result.maxAgeSeconds });

    return respond(path, {
      data: result.response,
      status: 201
    });
  } catch (error) {
    return handleRouteError(path, error);
  }
};
