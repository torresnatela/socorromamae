import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { ulid } from "ulid";

export type SessionPayload = {
  caregiverId: string;
  authUserId: string;
  email: string;
  consentVersion: string;
  keepSignedIn: boolean;
};

const encoder = new TextEncoder();

const getSecret = () => {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_JWT_SECRET is not configured.");
  }

  return encoder.encode(secret);
};

const getExpirationSeconds = (keepSignedIn: boolean) =>
  keepSignedIn ? 60 * 60 * 24 * 30 : 60 * 60 * 8;

export const createSessionToken = async (payload: SessionPayload) => {
  const maxAgeSeconds = getExpirationSeconds(payload.keepSignedIn);

  const token = await new SignJWT({
    email: payload.email,
    consentVersion: payload.consentVersion,
    keepSignedIn: payload.keepSignedIn
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.caregiverId)
    .setJti(ulid())
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .setAudience(payload.authUserId)
    .sign(getSecret());

  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  return { token, maxAgeSeconds, expiresAt };
};

export const verifySessionToken = async (token: string) => {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as JWTPayload & {
    sub: string;
    email: string;
    consentVersion: string;
    keepSignedIn: boolean;
    aud?: string;
  };
};
