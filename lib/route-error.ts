import { respond } from "./api-response";
import { ApplicationError } from "./errors";

export const handleRouteError = (path: string, error: unknown) => {
  if (error instanceof ApplicationError) {
    return respond(path, {
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      status: error.status
    });
  }

  console.error(error);
  return respond(path, {
    error: {
      code: "internal_error",
      message: "Unexpected error."
    },
    status: 500
  });
};
