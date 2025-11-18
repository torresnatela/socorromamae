import { Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";
import { timeline, readinessChecklist, mockChild } from "@/lib/mock-data";

const ProgressPage = () => (
  <AuthGuard requireConsent>
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-purple-700 font-semibold">
            Progresso
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900">{mockChild.name}</h1>
          <p className="text-neutral-600">
            Tela trazida do ZIP: checklist, eventos e visão rápida de prontidão, tudo mockado.
          </p>
        </div>
        <Badge>
          <TrendingUp className="h-4 w-4" />
          3/5 pronto
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-purple-700" />
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-purple-700 font-semibold">
                Linha do tempo
              </p>
              <h2 className="text-xl font-semibold text-neutral-900">Eventos recentes</h2>
            </div>
          </div>
          <div className="space-y-3">
            {timeline.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span className="uppercase font-semibold">{event.type}</span>
                  <span>· {event.when}</span>
                </div>
                <p className="font-semibold text-neutral-900">{event.label}</p>
                {event.note && <p className="text-sm text-neutral-600">{event.note}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-purple-700 font-semibold">
                Checklist
              </p>
              <h2 className="text-xl font-semibold text-neutral-900">Prontidão</h2>
              <p className="text-neutral-600 text-sm">Sem mutações nesta story; tudo estático.</p>
            </div>
            <div className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
              {readinessChecklist.filter((item) => item.checked).length} / {readinessChecklist.length}
            </div>
          </div>
          <div className="space-y-3">
            {readinessChecklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl ${item.checked ? "bg-green-50 text-green-700 border border-green-200" : "bg-white text-neutral-500 border border-neutral-200"}`}
                >
                  {item.checked ? "✓" : item.id}
                </div>
                <p className="text-neutral-800">{item.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
        <div className="flex-1 min-w-[240px]">
          <p className="text-sm uppercase tracking-[0.15em] text-purple-700 font-semibold">
            Próximos passos
          </p>
          <p className="text-neutral-700">
            Quando a API estiver disponível, este módulo deve receber dados reais e atualizar a
            barra de prontidão. Por enquanto, servirá como baseline de layout e responsividade.
          </p>
        </div>
        <Button variant="outline">Ver chat</Button>
        <Button>Registrar novo evento</Button>
      </div>
    </section>
  </AuthGuard>
);

export default ProgressPage;
