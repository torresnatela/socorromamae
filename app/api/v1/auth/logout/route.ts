import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session-cookie";
import { respond } from "@/lib/api-response";

const path = "/api/v1/auth/logout";

export const POST = async () => {
  clearSessionCookie();
  return respond(path, {
    data: { success: true }
  });
};
