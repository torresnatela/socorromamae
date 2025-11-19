"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, LoaderCircle, LogIn, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSessionQuery } from "@/src/domain/auth/session";

type AuthGuardProps = {
  children: ReactNode;
  requireConsent?: boolean;
};

type GuardMessageProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

const GuardMessage = ({ title, description, actionLabel, onAction, icon }: GuardMessageProps) => (
  <Card className="mx-auto max-w-xl p-6 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
      {icon}
    </div>
    <h2 className="mt-4 text-lg font-semibold text-neutral-900">{title}</h2>
    <p className="mt-2 text-sm text-neutral-600">{description}</p>
    {actionLabel && onAction && (
      <div className="mt-4 flex justify-center">
        <Button onClick={onAction} size="lg">
          {actionLabel}
        </Button>
      </div>
    )}
  </Card>
);

export const AuthGuard = ({ children, requireConsent = true }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isLoading, isFetching, refetch } = useSessionQuery();
  const isChecking = isLoading || isFetching;
  const hasConsent = session?.consentAccepted ?? true;

  useEffect(() => {
    if (!isChecking && !session) {
      router.replace("/login");
    }
  }, [isChecking, session, router]);

  if (isChecking) {
    return (
      <GuardMessage
        title="Validando sessão"
        description="Estamos confirmando sua sessão e consentimento antes de liberar a página."
        icon={<LoaderCircle className="h-5 w-5 animate-spin" />}
      />
    );
  }

  if (!session) {
    return (
      <GuardMessage
        title="Sessão expirada ou ausente"
        description="Faça login novamente para acessar esta área protegida."
        actionLabel="Ir para login"
        onAction={() => router.push("/login")}
        icon={<LogIn className="h-5 w-5" />}
      />
    );
  }

  if (requireConsent && !hasConsent) {
    return (
      <GuardMessage
        title="Consentimento pendente"
        description="Precisamos do consentimento LGPD ativo para liberar este conteúdo."
        actionLabel="Revisar login"
        onAction={() => router.push("/login")}
        icon={<ShieldAlert className="h-5 w-5" />}
      />
    );
  }

  return (
    <>
      {children}
      <div className="sr-only">
        <button type="button" onClick={() => refetch()}>
          Revalidar sessão
        </button>
      </div>
    </>
  );
};
