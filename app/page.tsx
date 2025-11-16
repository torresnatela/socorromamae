import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Activity, Baby, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockChild, readinessChecklist, timeline } from "@/lib/mock-data";

const flows = [
  {
    title: "Cadastro da criança",
    description: "Formulário com idade, peso, altura e compartilhamento com outro cuidador.",
    href: "/register/child"
  },
  {
    title: "Cadastro do cuidador",
    description: "Dados de responsável, endereço e consentimento LGPD prontos para wiring.",
    href: "/register/caregiver"
  },
  {
    title: "Assinatura e health",
    description: "Tela de planos e rota /health estática para monitoramento básico.",
    href: "/subscription"
  }
];

const HomePage = () => (
  <section className="space-y-10">
    <Card className="overflow-hidden border-none bg-gradient-to-br from-purple-600 via-purple-700 to-pink-500 text-white shadow-card">
      <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <p className="pill bg-white/15 text-white ring-1 ring-white/25">
            ZIP Figma → Next.js App Router
          </p>
          <h1 className="font-display text-3xl leading-tight lg:text-4xl">
            Base UX importada com rotas dedicadas
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Screens de login, cadastro, assinatura, chat, progresso e /health foram portadas
            do ZIP React. Tudo usa dados estáticos para facilitar a futura integração com
            APIs internas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login">
              <Button variant="secondary" size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
                Entrar na UI base <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/health">
              <Button variant="ghost" size="lg" className="border border-white/30 bg-white/10 text-white hover:bg-white/20">
                Ver rota /health <Activity className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-white/10 p-6 text-white backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Baby className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-white/70">Perfil ativo</p>
              <p className="text-xl font-semibold">{mockChild.name}</p>
              <p className="text-white/80">{mockChild.ageLabel}</p>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm text-white/80">
            <p>Prontidão: <span className="font-semibold text-white">3/5 checkpoints</span></p>
            <p>Último evento: {timeline[0].label}</p>
            <p>LGPD: consentimento capturado (estático)</p>
          </div>
        </Card>
      </div>
    </Card>

    <div className="grid gap-6 md:grid-cols-3">
      {flows.map((flow) => (
        <Card key={flow.href} className="p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-700">Fluxo</p>
              <h2 className="text-xl font-semibold text-neutral-900">{flow.title}</h2>
              <p className="text-neutral-600">{flow.description}</p>
            </div>
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <Link href={flow.href}>
            <Button variant="outline" className="mt-6">
              Abrir tela <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-700">Chat + timeline</p>
            <h3 className="text-xl font-semibold text-neutral-900">Eventos recentes</h3>
          </div>
          <Badge>
            <ShieldCheck className="h-4 w-4" />
            Sem backend
          </Badge>
        </div>
        <div className="mt-4 space-y-4">
          {timeline.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1 rounded-xl border border-neutral-200 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-neutral-500">{item.type}</span>
                <span className="text-sm text-neutral-500">· {item.when}</span>
              </div>
              <p className="font-semibold text-neutral-900">{item.label}</p>
              {item.note && <p className="text-sm text-neutral-600">{item.note}</p>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-green-700">Prontidão</p>
            <h3 className="text-xl font-semibold text-neutral-900">Checklist estático</h3>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {readinessChecklist.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${item.checked ? "border-green-300 bg-green-50 text-green-700" : "border-neutral-200 bg-white text-neutral-500"}`}
                aria-hidden
              >
                {item.checked ? <CheckCircle className="h-5 w-5" /> : item.id}
              </div>
              <p className="text-neutral-800">{item.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </section>
);

export default HomePage;
