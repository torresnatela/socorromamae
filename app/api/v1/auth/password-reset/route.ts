import { NextRequest } from "next/server";
import { passwordResetRequestSchema } from "@/src/domain/auth/schemas";
import { requestPasswordReset } from "@/src/domain/auth/service";
import { ValidationError } from "@/lib/errors";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";

const path = "/api/v1/auth/password-reset";

export const POST = async (request: NextRequest) => {
  try {
    const json = await request.json();
    const parsed = passwordResetRequestSchema.safeParse(json);

    if (!parsed.success) {
      throw new ValidationError("Invalid email payload.", parsed.error.flatten());
    }

    await requestPasswordReset(parsed.data);

    return respond(path, {
      data: { success: true }
    });
  } catch (error) {
    return handleRouteError(path, error);
  }
};
