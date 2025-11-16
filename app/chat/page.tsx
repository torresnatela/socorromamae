"use client";

import { useState } from "react";
import { Sparkles, Send, MessageCircle, BarChart3, Trash2, Baby, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockChild, readinessChecklist } from "@/lib/mock-data";

type Message = {
  id: string;
  author: "ai" | "user";
  text: string;
  hint?: string;
};

const quickActions = [
  { id: "xixi", label: "Registrar xixi", response: "Vou registrar o xixi e sugerir próximo lembrete em 2h." },
  { id: "sentou", label: "Sentou no penico", response: "Ótimo treino! Mantenha 3-5 minutos e sem pressão." },
  { id: "acidente", label: "Acidente", response: "Tudo bem, lembre de linguagem positiva e tente novamente." }
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      author: "ai",
      text: `Oi! Vejo que ${mockChild.name} tem ${mockChild.ageLabel}. Quer começar marcando um evento?`,
      hint: "Esta resposta é mock, sem chamadas externas."
    }
  ]);
  const [input, setInput] = useState("");

  const pushAIResponse = (text: string, hint?: string) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: "ai", text, hint }]);
    }, 550);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const messageText = input.trim();
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: "user", text: messageText }]);
    setInput("");
    pushAIResponse("Resposta simulada. Troque pelo serviço de IA real quando disponível.", "Mock");
  };

  const handleQuick = (action: (typeof quickActions)[number]) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), author: "user", text: `/${action.id} agora` }
    ]);
    pushAIResponse(action.response, "Gerado localmente");
  };

  const handleClear = () => setMessages([]);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={mockChild.name} className="h-11 w-11" />
            <div>
              <p className="text-sm text-neutral-500">Chat de onboarding</p>
              <p className="text-lg font-semibold text-neutral-900">{mockChild.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleClear} aria-label="Limpar histórico">
              <Trash2 className="h-4 w-4" /> Limpar
            </Button>
            <Badge tone="muted">
              <Sparkles className="h-4 w-4" />
              AI mock
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="secondary"
              size="sm"
              onClick={() => handleQuick(action)}
              className="rounded-full"
            >
              /{action.id} · {action.label}
            </Button>
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 max-h-[420px] overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-sm text-neutral-600">Histórico limpo. Envie uma mensagem para reativar.</p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-1 rounded-xl px-3 py-2 ${message.author === "ai" ? "bg-white" : "bg-purple-50"}`}
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
                {message.author === "ai" ? <Sparkles className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                <span>{message.author === "ai" ? "Assistente" : "Você"}</span>
              </div>
              <p className="text-neutral-900">{message.text}</p>
              {message.hint && <p className="text-xs text-neutral-500">{message.hint}</p>}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            aria-label="Mensagem para o copiloto"
          />
          <Button onClick={handleSend} aria-label="Enviar mensagem">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-purple-700" />
          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-purple-700 font-semibold">
              Resumo
            </p>
            <h2 className="text-xl font-semibold text-neutral-900">Prontidão e perfil</h2>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-500">Criança</p>
          <p className="text-lg font-semibold text-neutral-900">{mockChild.name}</p>
          <p className="text-sm text-neutral-600">{mockChild.ageLabel}</p>
          <p className="text-sm text-neutral-600">
            Peso {mockChild.weight} kg · Altura {mockChild.height} cm
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-purple-700" />
            <p className="font-semibold text-neutral-900">Checklist de prontidão (mock)</p>
          </div>
          <div className="grid gap-2">
            {readinessChecklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${item.checked ? "border-green-200 bg-green-50" : "border-neutral-200 bg-white"}`}
              >
                <div className="h-5 w-5 rounded-full border border-neutral-300 bg-white text-center text-xs font-semibold text-neutral-500">
                  {item.checked ? "✔" : ""}
                </div>
                <p className="text-sm text-neutral-800">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default ChatPage;
