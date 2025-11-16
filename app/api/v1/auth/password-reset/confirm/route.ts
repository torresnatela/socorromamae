import { NextRequest } from "next/server";
import { passwordResetConfirmSchema } from "@/src/domain/auth/schemas";
import { confirmPasswordReset } from "@/src/domain/auth/service";
import { respond } from "@/lib/api-response";
import { handleRouteError } from "@/lib/route-error";
import { ValidationError } from "@/lib/errors";

const path = "/api/v1/auth/password-reset/confirm";

export const POST = async (request: NextRequest) => {
  try {
    const json = await request.json();
    const parsed = passwordResetConfirmSchema.safeParse(json);

    if (!parsed.success) {
      throw new ValidationError("Invalid password reset payload.", parsed.error.flatten());
    }

    await confirmPasswordReset(parsed.data);

    return respond(path, {
      data: { success: true }
    });
  } catch (error) {
    return handleRouteError(path, error);
  }
};
