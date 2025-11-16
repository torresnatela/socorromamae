import { cookies } from "next/headers";

export const SESSION_COOKIE = "sm.session";

type CookieOptions = {
  maxAge: number;
};

export const setSessionCookie = (token: string, options: CookieOptions) => {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: options.maxAge
  });
};

export const clearSessionCookie = () => {
  cookies().delete(SESSION_COOKIE);
};

export const readSessionCookie = () => cookies().get(SESSION_COOKIE)?.value ?? null;
