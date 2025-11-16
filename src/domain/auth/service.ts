import { createSupabaseAdminClient, createSupabaseAnonClient } from "@/lib/supabase";
import { ApplicationError, ConflictError, UnauthorizedError } from "@/lib/errors";
import { createSessionToken, verifySessionToken } from "@/lib/jwt";
import {
  createCaregiver,
  findCaregiverByEmail,
  findCaregiverById,
  insertConsent
} from "./repository";
import {
  LoginInput,
  PasswordResetRequestInput,
  RefreshSessionInput,
  SignupInput
} from "./schemas";
import { AuthResponsePayload, SubscriptionSnapshot } from "./types";

const consentVersion = () => process.env.LGPD_CONSENT_VERSION ?? "v1";

const buildSubscriptionStub = (): SubscriptionSnapshot => {
  const now = Date.now();
  return {
    status: "trialing",
    trialEndsAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
    renewalAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
};

export const signupCaregiver = async (
  input: SignupInput
): Promise<{ response: AuthResponsePayload; sessionToken: string; maxAgeSeconds: number }> => {
  const adminClient = createSupabaseAdminClient();

  const existing = await findCaregiverByEmail(adminClient, input.email);
  if (existing) {
    throw new ConflictError("Caregiver already exists for this email address.");
  }

  const { data: userResult, error: userError } = await adminClient.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true
  });

  if (userError || !userResult.user) {
    throw new ApplicationError("supabase_user_create_failed", userError?.message ?? "Failed to create user.");
  }

  const caregiver = await createCaregiver(adminClient, {
    authUserId: userResult.user.id,
    fullName: input.fullName,
    email: input.email
  });

  const lgpdVersion = consentVersion();
  await insertConsent(adminClient, {
    caregiverId: caregiver.id,
    consentVersion: lgpdVersion
  });

  const session = await createSessionToken({
    caregiverId: caregiver.id,
    authUserId: caregiver.authUserId,
    email: caregiver.email,
    consentVersion: lgpdVersion,
    keepSignedIn: input.keepSignedIn ?? false
  });

  return {
    sessionToken: session.token,
    maxAgeSeconds: session.maxAgeSeconds,
    response: {
      caregiverId: caregiver.id,
      sessionExpiresAt: session.expiresAt.toISOString(),
      subscription: buildSubscriptionStub()
    }
  };
};

export const loginCaregiver = async (
  input: LoginInput
): Promise<{ response: AuthResponsePayload; sessionToken: string; maxAgeSeconds: number }> => {
  const authClient = createSupabaseAnonClient();
  const { data, error } = await authClient.auth.signInWithPassword({
    email: input.email,
    password: input.password
  });

  if (error || !data.user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const adminClient = createSupabaseAdminClient();
  const caregiver = await findCaregiverByEmail(adminClient, input.email);

  if (!caregiver) {
    throw new ApplicationError("caregiver_not_found", "Caregiver record not found.", 404);
  }

  const session = await createSessionToken({
    caregiverId: caregiver.id,
    authUserId: caregiver.authUserId,
    email: caregiver.email,
    consentVersion: consentVersion(),
    keepSignedIn: input.keepSignedIn ?? false
  });

  return {
    sessionToken: session.token,
    maxAgeSeconds: session.maxAgeSeconds,
    response: {
      caregiverId: caregiver.id,
      sessionExpiresAt: session.expiresAt.toISOString(),
      subscription: buildSubscriptionStub()
    }
  };
};

export const getCurrentCaregiver = async (token: string): Promise<AuthResponsePayload> => {
  let payload;
  try {
    payload = await verifySessionToken(token);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired session.");
  }
  const adminClient = createSupabaseAdminClient();
  const caregiver = await findCaregiverById(adminClient, payload.sub!);
  const expirationUnix = payload.exp ?? Math.floor(Date.now() / 1000);

  return {
    caregiverId: caregiver.id,
    sessionExpiresAt: new Date(expirationUnix * 1000).toISOString(),
    subscription: buildSubscriptionStub()
  };
};

export const refreshSession = async (
  token: string,
  input: RefreshSessionInput
): Promise<{ response: AuthResponsePayload; sessionToken: string; maxAgeSeconds: number }> => {
  let payload;
  try {
    payload = await verifySessionToken(token);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired session.");
  }

  const adminClient = createSupabaseAdminClient();
  const caregiver = await findCaregiverById(adminClient, payload.sub!);

  const session = await createSessionToken({
    caregiverId: caregiver.id,
    authUserId: caregiver.authUserId,
    email: caregiver.email,
    consentVersion: payload.consentVersion ?? consentVersion(),
    keepSignedIn: input.keepSignedIn ?? (payload.keepSignedIn ?? false)
  });

  return {
    sessionToken: session.token,
    maxAgeSeconds: session.maxAgeSeconds,
    response: {
      caregiverId: caregiver.id,
      sessionExpiresAt: session.expiresAt.toISOString(),
      subscription: buildSubscriptionStub()
    }
  };
};

export const requestPasswordReset = async (input: PasswordResetRequestInput) => {
  const client = createSupabaseAnonClient();
  const redirectTo = process.env.PASSWORD_RESET_REDIRECT_URL;
  const { error } = await client.auth.resetPasswordForEmail(input.email, {
    redirectTo: redirectTo && redirectTo.length > 0 ? redirectTo : undefined
  });

  if (error) {
    throw new ApplicationError("password_reset_failed", error.message);
  }
};
