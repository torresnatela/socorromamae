"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  ShieldCheck
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ApiErrorPayload } from "@/lib/api-response";

type ApiResponse<T> = {
  meta: {
    requestId: string;
    timestamp: string;
    path: string;
  };
  data?: T;
  error?: ApiErrorPayload;
};

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha precisa de pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme usando a mesma senha.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam coincidir.",
    path: ["confirmPassword"]
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    const extractToken = () => {
      if (typeof window === "undefined") return null;

      // Favor Next.js searchParams first.
      const queryToken =
        searchParams.get("access_token") ??
        searchParams.get("token") ??
        searchParams.get("code") ??
        searchParams.get("auth_token");
      if (queryToken) return queryToken;

      // Then parse the current URL (covers cases where searchParams missed hash parsing).
      const url = new URL(window.location.href);
      const directToken =
        url.searchParams.get("access_token") ??
        url.searchParams.get("token") ??
        url.searchParams.get("code") ??
        url.searchParams.get("auth_token");
      if (directToken) return directToken;

      // Supabase recovery links commonly return tokens in the hash fragment (e.g. #access_token=...).
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      const hashToken =
        hashParams.get("access_token") ??
        hashParams.get("token") ??
        hashParams.get("code") ??
        hashParams.get("auth_token");
      return hashToken;
    };

    const token = extractToken();
    if (token) {
      setRecoveryToken(token);
    }
  }, [searchParams, setValue]);

  const handleReset = async (values: ResetPasswordValues) => {
    setServerError(null);
    setSuccessMessage(null);

    if (!recoveryToken) {
      setServerError("Token de redefinição não encontrado. Abra o link enviado por email novamente.");
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accessToken: recoveryToken, password: values.password })
      });

      const payload = (await response.json()) as ApiResponse<{ success: boolean }>;

      if (!response.ok || payload.error || !payload.data?.success) {
        throw new Error(payload.error?.message ?? "Não foi possível redefinir sua senha.");
      }

      setSuccessMessage("Senha atualizada com sucesso! Você já pode fazer login novamente.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao confirmar redefinição de senha.";
      setServerError(message);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-sm">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
              Redefinição
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">Defina uma nova senha</h1>
            <p className="text-sm text-neutral-600">
              Use o token recebido por email para validar a operação.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleReset)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-800" htmlFor="password">
              Nova senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                className="pr-12"
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-800"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-800" htmlFor="confirmPassword">
              Confirme a senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                className="pr-12"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-800"
                aria-label={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Não foi possível redefinir</p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Senha atualizada</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Salvando...
              </>
            ) : (
              "Atualizar senha"
            )}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
          <Link href="/forgot-password" className="inline-flex items-center gap-2 font-semibold text-purple-700">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <Link href="/login" className="font-semibold text-purple-700 hover:underline">
            Ir para login
          </Link>
        </div>
      </Card>

      <Card className="p-6 bg-neutral-50">
        <h2 className="text-lg font-semibold text-neutral-900">Após confirmar</h2>
        <div className="mt-3 space-y-3 text-neutral-700">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>
              Chamada real para `/api/v1/auth/password-reset/confirm` usando o `access_token` enviado
              pelo Supabase.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Validação de token + senha com mensagens de erro inline.</span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Sucesso exibe confirmação e CTA para login.</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
