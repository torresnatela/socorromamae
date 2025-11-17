"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Baby } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ChildForm = {
  name: string;
  birthDate: string;
  weight: string;
  height: string;
};

const ChildRegistrationPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<ChildForm>({
    name: "",
    birthDate: "",
    weight: "",
    height: ""
  });

  const handleChange = (key: keyof ChildForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/register/caregiver");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
            Cadastro da criança
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900">Dados estáticos para UI</h1>
          <p className="text-neutral-600">
            Estrutura importada do ZIP; nada persiste no localStorage ou Supabase nesta story.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
          <Baby className="h-6 w-6" />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da criança</Label>
            <Input
              id="name"
              placeholder="Ex: Maria"
              value={form.name}
              onChange={(e) => handleChange("name")(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate")(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="12.4"
                value={form.weight}
                onChange={(e) => handleChange("weight")(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="87"
                value={form.height}
                onChange={(e) => handleChange("height")(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-2 rounded-xl bg-neutral-50 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">LGPD</p>
          <p>Somente UI: nenhuma chamada de API ou armazenamento local nesta etapa.</p>
        </Card>

        <div className="lg:col-span-2 flex flex-col gap-3">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            Continuar para cuidador
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChildRegistrationPage;
