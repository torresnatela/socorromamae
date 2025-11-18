"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiErrorPayload } from "@/lib/api-response";
import type { SubscriptionSnapshot } from "@/src/domain/auth/types";

export type SessionSnapshot = {
  caregiverId: string;
  sessionExpiresAt?: string;
  subscription: SubscriptionSnapshot;
  consentAccepted?: boolean;
};

type ApiResponse<T> = {
  meta: {
    requestId: string;
    timestamp: string;
    path: string;
  };
  data?: T;
  error?: ApiErrorPayload;
};

const fetchSession = async (): Promise<SessionSnapshot | null> => {
  try {
    const response = await fetch("/api/v1/auth/me", {
      credentials: "include",
      cache: "no-store"
    });

    const payload = (await response.json()) as ApiResponse<SessionSnapshot>;

    if (response.status === 401 || response.status === 403) {
      return null;
    }

    if (!response.ok || payload.error || !payload.data) {
      throw new Error(payload.error?.message ?? "Não foi possível ler a sessão.");
    }

    return payload.data;
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return null;
  }
};

export const useSessionQuery = () =>
  useQuery<SessionSnapshot | null>({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 60_000,
    gcTime: 300_000
  });

export const SessionBootstrapper = () => {
  useSessionQuery();
  return null;
};
