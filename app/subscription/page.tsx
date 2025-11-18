"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Check, CreditCard } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "trial",
    name: "Teste guiado",
    price: "7 dias",
    note: "Sem cobrança, apenas UX pronta para integração",
    perks: ["Checklist de prontidão", "Chat de onboarding", "Eventos mock"]
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 29/mês",
    note: "Cobrança mock — botão gera feedback local",
    perks: ["Acesso completo", "Sincronização cuidadores", "Relatórios de progresso"]
  }
];

const SubscriptionPage = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleSelect = (plan: string) => {
    setStatus(`Plano ${plan} selecionado (simulado). Substituir por Stripe/Supabase depois.`);
  };

  return (
    <AuthGuard requireConsent>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
              Assinatura
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">Tela importada do ZIP</h1>
            <p className="text-neutral-600">
              Dados totalmente estáticos para esta story; pronto para ligar nos endpoints reais.
            </p>
          </div>
          <Badge tone="success">
            <BadgeCheck className="h-4 w-4" />
            LGPD safe (mock)
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
                    {plan.name}
                  </p>
                  <h2 className="text-3xl font-semibold text-neutral-900">{plan.price}</h2>
                  <p className="text-neutral-600">{plan.note}</p>
                </div>
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <ul className="space-y-2 text-sm text-neutral-700">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    {perk}
                  </li>
                ))}
              </ul>
              <Button className="w-full" size="lg" onClick={() => handleSelect(plan.name)}>
                Ativar {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        {status && (
          <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <p>{status}</p>
            <Link href="/home" className="inline-flex">
              <Button variant="secondary" size="sm">
                Ir para o painel principal
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default SubscriptionPage;
