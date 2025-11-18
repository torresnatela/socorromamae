"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Mail,
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um email válido.")
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const handleRequest = async (values: ForgotPasswordValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/v1/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });

      const payload = (await response.json()) as ApiResponse<{ success: boolean }>;

      if (!response.ok || payload.error || !payload.data?.success) {
        throw new Error(payload.error?.message ?? "Não foi possível iniciar a recuperação.");
      }

      setSuccessMessage(
        "Enviamos um email com o link de redefinição. Verifique também a caixa de spam."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao solicitar redefinição de senha.";
      setServerError(message);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
              Segurança
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">Recupere sua senha</h1>
            <p className="text-sm text-neutral-600">
              Usuários reais recebem um email com o link de redefinição.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleRequest)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-800" htmlFor="email">
              Email da conta
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <Input
                id="email"
                type="email"
                placeholder="cuidador@email.com"
                className="pl-10"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </div>
            {errors.email?.message && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {serverError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Não foi possível enviar</p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Email enviado</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Receber link"
            )}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
          <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-purple-700">
            <ArrowLeft className="h-4 w-4" />
            Voltar para login
          </Link>
        </div>
      </Card>

      <Card className="p-6 bg-neutral-50">
        <h2 className="text-lg font-semibold text-neutral-900">Como funciona</h2>
        <div className="mt-3 space-y-3 text-neutral-700">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Chamada real para `/api/v1/auth/password-reset` com validação de envelope.</span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Mensagens em português e foco em erros de credencial ou usuário inexistente.</span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Sucesso mostra orientação para verificar email ou spam.</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
