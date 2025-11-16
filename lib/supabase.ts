import { createClient } from "@supabase/supabase-js";

type SupabaseEnv = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

const readSupabaseEnv = (): SupabaseEnv => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
});

export const createSupabaseBrowserClient = () => {
  const { url, anonKey } = readSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error(
      "Supabase environment variables are missing. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, anonKey);
};

export const createSupabaseAdminClient = () => {
  const { url, anonKey, serviceRoleKey } = readSupabaseEnv();

  if (!url || !anonKey || !serviceRoleKey) {
    throw new Error(
      "Supabase environment variables are missing. Configure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  });
};
