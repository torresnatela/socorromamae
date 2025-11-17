export type ChildProfile = {
  name: string;
  ageLabel: string;
  birthDate: string;
  weight: string;
  height: string;
  caregiverEmail?: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  checked?: boolean;
};

export type TimelineEvent = {
  id: string;
  type: "xixi" | "coco" | "acidente" | "sentou" | "liquidos" | "recompensa";
  label: string;
  when: string;
  note?: string;
};

export const mockChild: ChildProfile = {
  name: "Ana Clara",
  ageLabel: "2 anos e 1 mês",
  birthDate: "2023-09-01",
  weight: "12.4",
  height: "87",
  caregiverEmail: "vovo@socorromamae.com.br"
};

export const readinessChecklist: ChecklistItem[] = [
  { id: "1", text: "Fica seco por 1–2 horas", checked: true },
  { id: "2", text: "Reconhece vontade de ir ao banheiro", checked: true },
  { id: "3", text: "Senta e levanta com apoio", checked: false },
  { id: "4", text: "Segue instruções simples", checked: true },
  { id: "5", text: "Mostra interesse em largar a fralda", checked: false }
];

export const timeline: TimelineEvent[] = [
  {
    id: "evt-1",
    type: "sentou",
    label: "Sentou no penico",
    when: "Hoje · 08:45",
    note: "Ficou 3 minutos, sem acidentes"
  },
  {
    id: "evt-2",
    type: "xixi",
    label: "Xixi registrado",
    when: "Ontem · 19:10",
    note: "Antes de dormir"
  },
  {
    id: "evt-3",
    type: "acidente",
    label: "Pequeno acidente",
    when: "Ontem · 16:30",
    note: "Estava brincando, reforçar lembrete pós-lanche"
  }
];
