import { SupabaseClient } from "@supabase/supabase-js";
import { CaregiverProfile } from "./types";

type CaregiverRow = {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  created_at: string;
};

const mapCaregiver = (row: CaregiverRow): CaregiverProfile => ({
  id: row.id,
  authUserId: row.auth_user_id,
  fullName: row.full_name,
  email: row.email,
  createdAt: row.created_at
});

export const findCaregiverByEmail = async (client: SupabaseClient, email: string) => {
  const { data, error } = await client
    .from<CaregiverRow>("caregivers")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data ? mapCaregiver(data) : null;
};

export const findCaregiverById = async (client: SupabaseClient, id: string) => {
  const { data, error } = await client
    .from<CaregiverRow>("caregivers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapCaregiver(data);
};

export const createCaregiver = async (
  client: SupabaseClient,
  payload: { authUserId: string; fullName: string; email: string }
) => {
  const { data, error } = await client
    .from<CaregiverRow>("caregivers")
    .insert({
      auth_user_id: payload.authUserId,
      full_name: payload.fullName,
      email: payload.email
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapCaregiver(data);
};

export const insertConsent = async (
  client: SupabaseClient,
  payload: { caregiverId: string; consentVersion: string }
) => {
  const { error } = await client.from("caregiver_consents").insert({
    caregiver_id: payload.caregiverId,
    consent_type: "lgpd_terms",
    consent_version: payload.consentVersion,
    accepted_at: new Date().toISOString()
  });

  if (error) {
    throw error;
  }
};
