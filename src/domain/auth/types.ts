export type SubscriptionSnapshot = {
  status: "trialing" | "inactive" | "active";
  trialEndsAt: string | null;
  renewalAt: string | null;
};

export type CaregiverProfile = {
  id: string;
  authUserId: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export type SessionInfo = {
  token: string;
  expiresAt: string;
  maxAgeSeconds: number;
};

export type AuthResponsePayload = {
  caregiverId: string;
  sessionExpiresAt: string;
  subscription: SubscriptionSnapshot;
};
