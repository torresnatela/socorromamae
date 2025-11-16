"use client";

import Link from "next/link";
import { useState } from "react";
import { Baby, Lock, Mail, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    setTimeout(() => {
      setMessage("Login simulado com sucesso. Sessão será ligada ao backend depois.");
      setIsLoading(false);
    }, 500);
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
            <h1 className="text-2xl font-semibold text-neutral-900">Entrar</h1>
            <p className="text-sm text-neutral-600">
              UI vinda do ZIP do Figma AI, agora em App Router.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-800">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <Input
                type="email"
                placeholder="cuidador@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-800">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {message}
            </div>
          )}

          <Button type="submit" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? (
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
          Não tem conta?{" "}
          <Link href="/register/caregiver" className="font-semibold text-purple-700 hover:underline">
            Criar nova
          </Link>
        </p>
      </Card>

      <Card className="p-6 bg-neutral-50">
        <h2 className="text-lg font-semibold text-neutral-900">Fluxo de autenticação</h2>
        <p className="mt-2 text-neutral-600">
          Todo o fluxo é estático para esta story (sem Supabase ou sessões). Quando o backend
          estiver pronto, substitua o setTimeout pelo client real.
        </p>
        <div className="mt-5 space-y-3">
          <FeatureItem title="Inputs estilizados" description="Imports do ZIP com ajustes de caminhos e Tailwind." />
          <FeatureItem title="Estados de carregamento" description="Botão mostra spinner com LoaderCircle." />
          <FeatureItem title="Links de navegação" description="Direciona rapidamente para cadastro do cuidador." />
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
