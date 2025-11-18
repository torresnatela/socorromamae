"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  Baby,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ApiErrorPayload } from "@/lib/api-response";
import type { AuthResponsePayload } from "@/src/domain/auth/types";

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
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-sm">
            <Baby className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
              Socorro Mamãe
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">Entre com sua conta</h1>
            <p className="text-sm text-neutral-600">
              Autenticação real via API. Cookies seguros serão definidos pelo backend.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-800" htmlFor="email">
              Email
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

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-800" htmlFor="password">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <Input
                id="password"
                placeholder="••••••••"
                className="pl-10 pr-12"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                type={showPassword ? "text" : "password"}
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

          <Controller
            control={control}
            name="keepSignedIn"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Manter-me conectado</p>
                  <p className="text-xs text-neutral-600">
                    Selecione para manter-se conectado.
                  </p>
                </div>
                <Switch
                  checked={field.value ?? false}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-label="Manter-me conectado"
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

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Validando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Não tem conta?
          <br/>
          <Link href="/register/child" className="font-semibold text-purple-700 hover:underline">
            Começar cadastro
          </Link>
        </p>
      </Card>

      <Card className="p-6 bg-neutral-50">
        <h2 className="text-lg font-semibold text-neutral-900">Fluxo de autenticação</h2>
        <div className="mt-2 space-y-3 text-neutral-700">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Chamada real para `/api/v1/auth/login` com envelope de erro exibido no formulário.</span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Cookie HTTP-only é configurado pelo backend; o toggle define sessões de 30 dias.</span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-5 w-5 text-purple-700" />
            <span>Mensagens em português e validação de email/senha via React Hook Form + Zod.</span>
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <FeatureItem
            title="Redirecionamento pós-login"
            description="Após sucesso, o usuário segue para /home com feedback imediato."
          />
          <FeatureItem
            title="Tratativa de erro"
            description="Erros de credenciais aparecem no formulário, mantendo os dados digitados."
          />
        </div>
      </Card>
    </div>
  );
};

const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
    <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
    <div>
      <p className="font-semibold text-neutral-900">{title}</p>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  </div>
);

export default LoginPage;
