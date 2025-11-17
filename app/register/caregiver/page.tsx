"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type CaregiverForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

const CaregiverRegistrationPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<CaregiverForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });

  const handleChange = (key: keyof CaregiverForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/subscription");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
            Cadastro do cuidador
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900">Fluxo estático</h1>
          <p className="text-neutral-600">
            Campos prontos para substituir por ações do backend. UX trazida direto do ZIP.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
          <UserRound className="h-6 w-6" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              placeholder="Ex: Camila Souza"
              value={form.fullName}
              onChange={(e) => handleChange("fullName")(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@email.com"
              value={form.email}
              onChange={(e) => handleChange("email")(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-0000"
              value={form.phone}
              onChange={(e) => handleChange("phone")(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange("password")(e.target.value)}
              required
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Rua Exemplo, 123 - São Paulo"
              value={form.address}
              onChange={(e) => handleChange("address")(e.target.value)}
            />
          </div>
          <div className="rounded-xl bg-neutral-50 p-4">
            <div className="flex items-center gap-2 text-purple-700">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm font-semibold">Consentimento LGPD</p>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              Texto placeholder do termo de consentimento. Nesta story, marcamos como aceito
              sem chamadas externas.
            </p>
          </div>
        </Card>

        <div className="lg:col-span-2 flex flex-col gap-3">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            Ir para pagamento
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CaregiverRegistrationPage;
