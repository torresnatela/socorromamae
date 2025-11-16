import { UnauthorizedError } from "@/src/lib/errors";
import { handleRouteError } from "@/src/lib/route-error";
import { respond } from "@/src/lib/api-response";
import { readSessionCookie } from "@/src/lib/session-cookie";
import { getCurrentCaregiver } from "@/src/domain/auth/service";

const path = "/api/v1/auth/me";

export const GET = async () => {
  try {
    const token = readSessionCookie();
    if (!token) {
      throw new UnauthorizedError("No active session.");
    }

    const profile = await getCurrentCaregiver(token);
    return respond(path, { data: profile });
  } catch (error) {
    return handleRouteError(path, error);
  }
};
