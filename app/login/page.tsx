"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Baby,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ApiErrorPayload } from "@/lib/api-response";
import type { AuthResponsePayload } from "@/src/domain/auth/types";
import type { SessionSnapshot } from "@/src/domain/auth/session";

type ApiResponse<T> = {
  meta: {
    requestId: string;
    timestamp: string;
    path: string;
  };
  data?: T;
  error?: ApiErrorPayload;
};

const loginFormSchema = z.object({
  email: z.string().email("Informe um email válido."),
  password: z.string().min(8, "A senha precisa de pelo menos 8 caracteres."),
  keepSignedIn: z.boolean()
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Supabase recovery links often land on /login with access_token in the hash.
  // If present, redirect straight to reset-password carrying the token.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const recoveryToken =
      hashParams.get("access_token") ??
      hashParams.get("token") ??
      hashParams.get("code") ??
      hashParams.get("auth_token");
    const isRecovery = hashParams.get("type") === "recovery";

    if (recoveryToken && isRecovery) {
      router.replace(`/reset-password?access_token=${encodeURIComponent(recoveryToken)}`);
    }
  }, [router]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: false
    }
  });

  const handleLogin = async (values: LoginFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });

      const payload = (await response.json()) as ApiResponse<AuthResponsePayload>;

      if (!response.ok || payload.error || !payload.data) {
        throw new Error(payload.error?.message ?? "Não foi possível entrar agora. Tente novamente.");
      }

      // Seed session cache so guards don’t bounce immediately after login.
      const sessionSnapshot: SessionSnapshot = {
        caregiverId: payload.data.caregiverId,
        sessionExpiresAt: payload.data.sessionExpiresAt,
        subscription: payload.data.subscription,
        consentAccepted: true
      };
      queryClient.setQueryData(["session"], sessionSnapshot);

      setSuccessMessage("Login realizado! Redirecionando para seu painel.");
      setTimeout(() => router.push("/home"), 600);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao entrar. Tente novamente.";
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[var(--background)] dark:to-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg">
            <Baby className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Socorro Mamãe
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">ByeBye Fralda</p>
        </div>

        <Card className="p-6 border border-neutral-200 shadow-lg dark:border-neutral-800">
          <h2 className="text-center text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
            Entrar na sua conta
          </h2>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm text-neutral-700 dark:text-neutral-300" htmlFor="email">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="cuidador@email.com"
                  className="pl-10 h-12 rounded-xl"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  disabled={isSubmitting}
                  {...register("email")}
                />
              </div>
              {errors.email?.message && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-sm text-neutral-700 dark:text-neutral-300" htmlFor="password">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl pl-10 pr-12"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  disabled={isSubmitting}
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-800 dark:hover:text-neutral-100"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-purple-700 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              {errors.password?.message && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Controller
              control={control}
              name="keepSignedIn"
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">Manter-me conectado</p>
                    <p className="text-neutral-600 dark:text-neutral-400">Sessão extensa em dispositivos confiáveis.</p>
                  </div>
                  <Switch
                    checked={field.value ?? false}
                    onChange={(event) => field.onChange(event.target.checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    aria-label="Manter-me conectado"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            />

            {serverError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-semibold">Não foi possível entrar</p>
                  <p>{serverError}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-semibold">Login aprovado</p>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-neutral-600 text-sm dark:text-neutral-300">
            Não tem uma conta?
          </p>
          <Link
            href="/register/child"
            aria-disabled={isSubmitting}
            tabIndex={isSubmitting ? -1 : 0}
            className="inline-flex w-full h-12 items-center justify-center rounded-xl border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold transition disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
          >
            Criar nova conta
          </Link>
          <p className="text-neutral-500 text-xs dark:text-neutral-400">
            Ao entrar, você concorda com nossos Termos de Uso
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
