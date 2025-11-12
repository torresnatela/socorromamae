import Head from 'next/head';
import { Fragment, useEffect, useMemo, useState } from 'react';

const readinessItems = [
  'Fica seco por 1–2 horas',
  'Percebe/sinaliza que vai urinar/evacuar',
  'Senta e levanta do penico/vaso com apoio',
  'Segue instruções simples',
  'Mostra interesse em largar a fralda',
];

const quickActions = [
  { label: 'Registrar xixi', command: '/xixi' },
  { label: 'Registrar cocô', command: '/coco' },
  { label: 'Acidente', command: '/acidente' },
  { label: 'Sentou no penico', command: '/sentou' },
  { label: 'Líquidos', command: '/liquidos' },
  { label: 'Recompensa', command: '/recompensa' },
];

const suggestedCards = [
  '🌟 Dica rápida · Adorei como Laura avisou antes! 👏',
  '⏱️ Começar rotina após refeições · Mantenha sessões curtas (3–5 min) e sem pressão.',
  '🪑 Ativar lembretes de ida ao penico · Garanta redutor + banquinho para apoiar os pés.',
  '🧼 Guia de higiene · Frente → trás + lavar mãos com apoio visual.',
];

const kpiCards = [
  { label: 'Sucessos últimos 7 dias', value: '18', detail: '↑ +4 vs semana anterior', trend: 'up' },
  { label: 'Acidentes últimos 7 dias', value: '5', detail: '↓ -2 vs semana anterior', trend: 'down' },
  { label: 'Maior intervalo seco (h)', value: '3.5h', detail: '↑ Estável', trend: 'up' },
  { label: 'Tendência geral', value: '↑ Positiva', detail: 'Rotina consistente', trend: 'up', highlight: true },
];

const barChartData = [
  { day: 'Seg', value: 72, type: 'success' },
  { day: 'Ter', value: 36, type: 'accident' },
  { day: 'Qua', value: 80, type: 'success' },
  { day: 'Qui', value: 64, type: 'success' },
  { day: 'Sex', value: 28, type: 'accident' },
  { day: 'Sáb', value: 88, type: 'success' },
  { day: 'Dom', value: 76, type: 'success' },
];

const heatmap = {
  headers: ['Manhã', 'Almoço', 'Tarde', 'Noite'],
  rows: [
    { label: 'Sucessos', values: [
      { value: '60%', intensity: 'medio' },
      { value: '82%', intensity: 'alto' },
      { value: '55%', intensity: 'medio' },
      { value: '25%', intensity: 'baixo' },
    ] },
    { label: 'Acidentes', values: [
      { value: '12%', intensity: 'baixo' },
      { value: '34%', intensity: 'medio' },
      { value: '48%', intensity: 'alto' },
      { value: '28%', intensity: 'medio' },
    ] },
  ],
};

const guidelineSections = [
  {
    title: 'Comportamento do chat',
    cards: [
      {
        title: '💬 Conversas curtas e empáticas.',
        description:
          'Chat aceita perguntas abertas e comandos estruturados. Feedback imediato “registrado” ao usar chips ou atalhos. Sugere lembretes, checklists e encaminha ao pediatra em sinais de alerta.',
      },
      {
        title: '🧠 Entidades extraídas',
        description:
          'Tipo de evento (xixi/cocô/acidente/sentou/líquidos/recompensa), horário, local (casa/creche), observações (dor, fezes duras, urgência).',
      },
    ],
  },
  {
    title: 'Comandos suportados',
    commands: [
      { command: '/xixi 10:35', description: 'Registra micção com horário.' },
      { command: '/coco 07:20', description: 'Registra evacuação.' },
      { command: '/acidente 16:05 sofá', description: 'Captura acidentes com local.' },
      { command: '/liquidos 150 ml', description: 'Monitora ingestão hídrica.' },
      { command: '/sentou 3 min', description: 'Controla tempo no penico/vaso.' },
      { command: '/recompensa adesivo', description: 'Registra reforços positivos.' },
    ],
  },
  {
    title: 'Tons & limites',
    cards: [
      {
        title: '🌟 Linguagem positiva',
        description:
          'Elogie tentativas e sucessos; evite punição. Sempre incluir orientação para procurar pediatra em sinais de alerta (dor persistente, sangue, constipação severa, regressões marcantes).',
      },
      {
        title: '🛑 Sinais de alerta',
        description:
          'Card específico com toggle: “Sinais de alerta — procure o pediatra” com detalhes sob demanda. Sugere pausa segura se houver estresse ou retenção.',
      },
    ],
  },
];

const additionalGuidelines = [
  {
    title: 'Cards inteligentes sugeridos',
    cards: [
      '⏱️ Agendar sentar após refeições (3–5 min)',
      '🌙 Configurar lembretes quando acorda seco',
      '🧼 Dica de linguagem positiva + higiene (frente→trás / lavar mãos)',
      '🛟 Sinais de pausa segura (se houver estresse/retenção)',
    ],
  },
  {
    title: 'Conteúdo baseado em evidência',
    cards: [
      'Prontidão: “Procure intervalos secos ≥ 1–2h, perceber quando fez/quer fazer, conseguir sentar e levantar, seguir instruções simples.”',
      'Rotina: “Convide a sentar no penico/toalete por 3–5 min após refeições ou ao acordar seco; não force.”',
      'Ambiente: “Redutor de assento + banquinho para apoiar os pés; penico acessível.”',
      'Linguagem: “Elogie tentativas e sucessos; evite punição e termos negativos.”',
      'Consistência: “Combine a abordagem com todos os cuidadores/creche.”',
      'Pausa se preciso: “Se houver estresse, retenção ou resistência intensa, faça uma pausa e retome depois.”',
    ],
  },
  {
    title: 'Estados & métricas monitoradas',
    cards: [
      'Estados: “Preparação”, “Treinamento diurno”, “Noturno”. KPIs: sucessos/dia, acidentes/dia, intervalo seco médio (h), janela provável (manhã/tarde/noite), adesão aos lembretes (%).',
      'Dados & privacidade: reforço de que o usuário controla compartilhamento com cuidadores e pode revogar convites.',
      'Feedback “registrado” com animação sutil ao usar chips ou preencher checklist.',
    ],
  },
];

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (now.getDate() < birth.getDate()) {
    months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  }

  return {
    years: Math.max(years, 0),
    months: Math.max(months, 0),
  };
}

function formatAge(age) {
  if (!age) return '';
  const yearLabel = age.years === 1 ? 'ano' : 'anos';
  const monthLabel = age.months === 1 ? 'mês' : 'meses';
  return `${age.years} ${yearLabel} e ${age.months} ${monthLabel}`;
}

export default function Home() {
  const [childData, setChildData] = useState({
    name: 'Laura',
    birthdate: '',
    weight: '',
    height: '',
  });
  const [shareCaregiver, setShareCaregiver] = useState(false);
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [ageDisplay, setAgeDisplay] = useState('2 anos e 1 mês');
  const [ageResultMessage, setAgeResultMessage] = useState('');
  const [showAgeResult, setShowAgeResult] = useState(false);
  const [checklistState, setChecklistState] = useState(() => readinessItems.map(() => false));
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [quickFeedback, setQuickFeedback] = useState('');
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetCaregiver, setSheetCaregiver] = useState('');
  const [reminders, setReminders] = useState({
    postMeals: true,
    afterNap: false,
    bedtime: true,
  });

  useEffect(() => {
    if (!quickFeedback) return undefined;
    const timeout = setTimeout(() => setQuickFeedback(''), 2400);
    return () => clearTimeout(timeout);
  }, [quickFeedback]);

  useEffect(() => {
    if (!showAgeResult || !ageDisplay) return;
    setAgeResultMessage((current) => {
      if (current.startsWith('Informe uma data')) {
        return current;
      }
      const name = childData.name || 'A criança';
      const message = `${name} tem ${ageDisplay}.`;
      return current === message ? current : message;
    });
  }, [childData.name, ageDisplay, showAgeResult]);

  const childInitial = useMemo(
    () => (childData.name ? childData.name.charAt(0).toUpperCase() : 'C'),
    [childData.name],
  );

  const handleChildChange = (event) => {
    const { name, value } = event.target;
    setChildData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const age = calculateAge(childData.birthdate);

    if (age) {
      const label = formatAge(age);
      setAgeDisplay(label);
      setAgeResultMessage(`${childData.name || 'A criança'} tem ${label}.`);
      setShowAgeResult(true);
    } else {
      setAgeResultMessage('Informe uma data de nascimento válida.');
      setShowAgeResult(true);
    }
  };

  const handleChecklistToggle = (index) => {
    setChecklistState((prev) => prev.map((value, idx) => (idx === index ? !value : value)));
  };

  const handleReminderChange = (key) => {
    setReminders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleQuickAction = (command) => {
    setQuickFeedback(`Comando ${command} registrado.`);
  };

  return (
    <>
      <Head>
        <title>Socorro Mamãe — ByeBye Fralda</title>
        <meta
          name="description"
          content="Apoio ao desfralde com orientações baseadas em pediatria."
        />
      </Head>
      <main>
        <header className="hero" aria-label="Socorro Mamãe — ByeBye Fralda">
          <div className="hero-title">
            <div className="logo-mark" aria-hidden="true">SM</div>
            <div className="hero-content">
              <h1>Socorro Mamãe — ByeBye Fralda</h1>
              <p className="lead">Apoio ao desfralde com orientações baseadas em pediatria.</p>
            </div>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary">
              Começar
            </button>
            <span className="microcopy">
              Conteúdo educativo; não substitui o pediatra. Dados privados; você controla o compartilhamento.
            </span>
          </div>
        </header>

        <section id="frame-01" className="frame" aria-labelledby="frame-01-title">
          <header>
            <h2 className="frame-title" id="frame-01-title">
              Frame 01 · Cadastro da Criança
            </h2>
            <span className="badge">Onboarding</span>
          </header>
          <p className="frame-meta">
            Coleta de dados mínimos para personalização das recomendações. Acessível, com campos claros e feedback
            imediato.
          </p>

          <form className="child-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="childName">Nome</label>
                <input
                  id="childName"
                  name="name"
                  type="text"
                  required
                  placeholder="Ex.: Laura"
                  value={childData.name}
                  onChange={handleChildChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="childBirth">Data de nascimento</label>
                <input
                  id="childBirth"
                  name="birthdate"
                  type="date"
                  required
                  value={childData.birthdate}
                  onChange={handleChildChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="childWeight">Peso (kg)</label>
                <input
                  id="childWeight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ex.: 12.5"
                  value={childData.weight}
                  onChange={handleChildChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="childHeight">Altura (cm)</label>
                <input
                  id="childHeight"
                  name="height"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ex.: 88"
                  value={childData.height}
                  onChange={handleChildChange}
                />
              </div>
            </div>

            <div className="switch">
              <span className="switch-label">Compartilhar com outro cuidador?</span>
              <input
                type="checkbox"
                checked={shareCaregiver}
                onChange={(event) => setShareCaregiver(event.target.checked)}
                aria-expanded={shareCaregiver}
                aria-controls="caregiverEmail"
              />
            </div>
            <div className={`form-field optional-field${shareCaregiver ? ' active' : ''}`} id="caregiverEmail">
              <label htmlFor="caregiverEmailInput">E-mail do cuidador</label>
              <input
                type="email"
                id="caregiverEmailInput"
                placeholder="nome@exemplo.com"
                value={caregiverEmail}
                onChange={(event) => setCaregiverEmail(event.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Salvar e continuar
            </button>
          </form>

          <div
            className={`info-card${showAgeResult ? ' active' : ''}`}
            role="status"
            aria-live="polite"
            hidden={!showAgeResult}
          >
            <span>{ageResultMessage}</span>
          </div>
        </section>

        <section id="frame-02" className="frame" aria-labelledby="frame-02-title">
          <header>
            <h2 className="frame-title" id="frame-02-title">
              Frame 02 · Chat com IA — Hub
            </h2>
            <span className="badge">Central de Conversa</span>
          </header>
          <p className="frame-meta">
            Conversas curtas, linguagem positiva e comandos rápidos para registrar eventos e tirar dúvidas.
          </p>

          <div className="chat-shell">
            <div className="chat-header">
              <div className="chat-profile">
                <div className="avatar" aria-hidden="true">
                  {childInitial}
                </div>
                <div className="chat-meta">
                  <h3>{childData.name || 'Criança'}</h3>
                  <span>{ageDisplay}</span>
                </div>
              </div>
              <div className="chat-actions">
                <a className="icon-btn" href="#frame-03" aria-label="Ver painel de progresso">
                  📈
                </a>
                <div className="icon-btn-wrap">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-expanded={sheetOpen}
                    aria-controls="configSheet"
                    onClick={() => setSheetOpen((prev) => !prev)}
                    aria-label="Abrir configurações"
                  >
                    ⚙️
                  </button>
                </div>
              </div>
            </div>

            <article className="checklist-card" aria-label="Checklist de prontidão">
              <button
                type="button"
                className="accordion-header"
                aria-expanded={isChecklistOpen}
                aria-controls="checklistBody"
                onClick={() => setIsChecklistOpen((prev) => !prev)}
              >
                <span>Checklist de prontidão</span>
                <span>{isChecklistOpen ? '▲' : '▼'}</span>
              </button>
              <div className={`accordion-body${isChecklistOpen ? ' active' : ''}`} id="checklistBody">
                {readinessItems.map((item, index) => (
                  <label key={item} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={checklistState[index]}
                      onChange={() => handleChecklistToggle(index)}
                    />
                    {item}
                  </label>
                ))}
                <button type="button" className="btn btn-primary">
                  Calcular prontidão
                </button>
              </div>
            </article>

            <div className="quick-actions">
              <h3>Chips de ação rápida</h3>
              <div className="chip-track" aria-label="Comandos rápidos">
                {quickActions.map((item) => (
                  <button key={item.command} type="button" className="chip" onClick={() => handleQuickAction(item.command)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="chat-window" aria-live="polite">
              <div className="chat-bubble ai">
                Oi, <span className="chat-name">{childData.name || 'Criança'}</span>! Vejo que{' '}
                <span className="chat-name">{childData.name || 'a criança'}</span> tem{' '}
                <span className="chat-age">{ageDisplay}</span>. Podemos começar pelo checklist de prontidão?
              </div>
              <div className="chat-bubble user">/xixi agora às 10:35</div>
              <div className="chat-bubble ai">Anotado! Quer ativar lembrete para após o almoço? (12:30)</div>
              <div className="chat-bubble user">Sim, e como apoiar os pés no vaso?</div>
              <div className="chat-bubble ai">
                Use redutor + banquinho para os pés. Isso melhora o posicionamento para evacuar. Posso te mostrar imagens e um
                checklist de higiene.
              </div>
            </div>

            <div className="suggested-cards" aria-label="Sugestões da IA">
              {suggestedCards.map((card) => (
                <div key={card} className="suggested-card">
                  {card}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <div className="input-shell">
                <button type="button" aria-label="Gravar mensagem de voz">
                  🎤
                </button>
                <input
                  type="text"
                  placeholder="Pergunte ou digite comandos: /xixi /coco /acidente /liquidos …"
                  aria-label="Campo para perguntas ou comandos"
                />
                <button type="button" aria-label="Anexar foto">
                  ＋
                </button>
              </div>
              <span className={`chat-feedback${quickFeedback ? ' visible' : ''}`} role="status" aria-live="polite">
                {quickFeedback}
              </span>
            </div>
          </div>
        </section>

        <section id="frame-03" className="frame" aria-labelledby="frame-03-title">
          <header>
            <h2 className="frame-title" id="frame-03-title">
              Frame 03 · Painel de Progresso
            </h2>
            <span className="badge">Insights rápidos</span>
          </header>
          <p className="frame-meta">
            KPIs claros, gráficos de 7 dias e ajustes rápidos de rotina para apoiar decisões.
          </p>

          <div className="progress-grid">
            <div className="kpi-cards">
              {kpiCards.map((card) => (
                <div key={card.label} className="kpi-card">
                  <span className="label">{card.label}</span>
                  <strong className={card.highlight ? 'trend-up' : ''}>{card.value}</strong>
                  <span className={card.trend === 'up' ? 'trend-up' : card.trend === 'down' ? 'trend-down' : ''}>{card.detail}</span>
                </div>
              ))}
            </div>

            <div className="chart-card" aria-label="Gráfico de sucessos e acidentes">
              <h3>Sucessos vs Acidentes (7 dias)</h3>
              <div className="bar-chart">
                {barChartData.map((item) => (
                  <div
                    key={item.day}
                    className={`bar${item.type === 'accident' ? ' acidente' : ''}`}
                    style={{ height: `${item.value}%` }}
                    data-day={item.day}
                  />
                ))}
              </div>
            </div>

            <div className="chart-card" aria-label="Heatmap de horários">
              <h3>Heatmap de horários — janelas prováveis</h3>
              <div className="heatmap">
                <div />
                {heatmap.headers.map((header) => (
                  <div key={header} className="slot" data-intensity="label">
                    {header}
                  </div>
                ))}
                {heatmap.rows.map((row) => (
                  <Fragment key={row.label}>
                    <div>{row.label}</div>
                    {row.values.map((value, index) => (
                      <div key={`${row.label}-${index}`} className="slot" data-intensity={value.intensity}>
                        {value.value}
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="chart-card" aria-label="Rotina e lembretes">
              <h3>Rotina &amp; Lembretes</h3>
              <div className="toggle-list">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={reminders.postMeals}
                    onChange={() => handleReminderChange('postMeals')}
                  />
                  Pós-refeições
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={reminders.afterNap}
                    onChange={() => handleReminderChange('afterNap')}
                  />
                  Após soneca
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={reminders.bedtime}
                    onChange={() => handleReminderChange('bedtime')}
                  />
                  Antes de dormir
                </label>
              </div>
              <div className="actions-row">
                <button type="button" className="btn btn-primary" onClick={() => setGoalsOpen(true)}>
                  Ajustar metas semanais
                </button>
                <button type="button" className="btn btn-secondary">
                  Adicionar cuidador/creche
                </button>
              </div>
              <div className="empty-state">
                Sem dados suficientes? Comece registrando pelo chat. Tente /xixi ou /sentou.
              </div>
            </div>
          </div>
        </section>

        <section id="frame-04" className="frame" aria-labelledby="frame-04-title">
          <header>
            <h2 className="frame-title" id="frame-04-title">
              Frame 04 · Diretrizes Conversacionais &amp; Segurança
            </h2>
            <span className="badge">Experiência</span>
          </header>
          <p className="frame-meta">
            Regras do chat, entidades extraídas e mensagens baseadas em evidência para consistência do produto.
          </p>

          <div className="commands-grid">
            {guidelineSections.map((section) => (
              <div key={section.title}>
                <h3>{section.title}</h3>
                {section.cards &&
                  section.cards.map((card) => (
                    <div key={card.title} className="guideline-card">
                      <span>{card.title}</span>
                      <p>{card.description}</p>
                    </div>
                  ))}
                {section.commands && (
                  <div className="command-list">
                    {section.commands.map((command) => (
                      <div key={command.command} className="command-item">
                        <strong>{command.command}</strong>
                        <span>{command.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="commands-grid">
            {additionalGuidelines.map((section) => (
              <div key={section.title}>
                <h3>{section.title}</h3>
                {section.cards.map((card) => (
                  <div key={card} className="guideline-card">
                    {card}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="alert-card">
            Sinais de alerta — procure o pediatra: dor persistente, sangue nas fezes/urina, constipação severa (fezes muito
            duras ou bolo fecal), regressões marcantes.
          </div>
          <p className="references">
            Fontes: NHS (How to potty train, rev. 04 nov 2022), Sociedade Brasileira de Pediatria — Treinamento
            Esfincteriano, American Academy of Pediatrics/HealthyChildren.org — Toilet Training: 12 Tips to Keep the Process
            Positive.
          </p>
        </section>
      </main>

      <div
        className={`modal${goalsOpen ? ' active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setGoalsOpen(false);
          }
        }}
      >
        <div className="modal-content">
          <button type="button" className="modal-close" onClick={() => setGoalsOpen(false)} aria-label="Fechar">
            ✕
          </button>
          <h4 id="modalTitle">Metas semanais sugeridas</h4>
          <ul>
            <li>Sentar 3–5 min após almoço.</li>
            <li>Refletir sobre sinais que a criança demonstra.</li>
            <li>Reforçar linguagem positiva e sem punições.</li>
          </ul>
          <button type="button" className="btn btn-primary" onClick={() => setGoalsOpen(false)}>
            Salvar metas
          </button>
        </div>
      </div>

      <aside className={`sheet${sheetOpen ? ' active' : ''}`} id="configSheet" aria-label="Configurações rápidas">
        <header>
          <h3>Configurações</h3>
          <button type="button" className="modal-close" onClick={() => setSheetOpen(false)} aria-label="Fechar">
            ✕
          </button>
        </header>
        <label htmlFor="sheetChildName">Editar nome da criança</label>
        <input
          id="sheetChildName"
          type="text"
          placeholder="Nome da criança"
          value={childData.name}
          onChange={(event) => {
            setChildData((prev) => ({ ...prev, name: event.target.value }));
          }}
        />
        <label htmlFor="sheetCaregiver">Adicionar cuidador</label>
        <input
          id="sheetCaregiver"
          type="email"
          placeholder="E-mail do cuidador"
          value={sheetCaregiver}
          onChange={(event) => setSheetCaregiver(event.target.value)}
        />
        <div className="sheet-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setSheetOpen(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setSheetOpen(false)}>
            Salvar alterações
          </button>
        </div>
      </aside>
    </>
  );
}
