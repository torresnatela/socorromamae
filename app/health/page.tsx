import { Activity, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HealthPage = () => (
  <section className="space-y-6">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
          Health estático
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">/health UI</h1>
        <p className="text-neutral-600">
          Rota pronta para monitoramento leve. Sem chamadas a Supabase ou APIs externas neste estágio.
        </p>
      </div>
      <Badge tone="success">
        <ShieldCheck className="h-4 w-4" />
        Ready
      </Badge>
    </div>

    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-green-700 font-semibold">Status</p>
          <h2 className="text-xl font-semibold text-neutral-900">healthy</h2>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="App Router" value="Next.js 14" />
        <Metric label="Banco" value="Desligado nesta story" />
        <Metric label="Última verificação" value="Simulada · agora" />
      </div>
      <p className="text-sm text-neutral-600">
        Esta página substitui o fetch para `/api/health` enquanto o backend não está configurado. Quando
        os serviços estiverem prontos, basta apontar para a rota real mantendo a UI.
      </p>
    </Card>
  </section>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">{label}</p>
    <p className="text-lg font-semibold text-neutral-900">{value}</p>
  </div>
);

export default HealthPage;
