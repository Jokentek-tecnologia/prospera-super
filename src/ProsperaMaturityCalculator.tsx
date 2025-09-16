import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, RefreshCw, Share2 } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * Prospera Super – Maturidade Digital no Comercial
 * Áreas: Vendas, Pré‑Vendas, Customer Success (CS)
 * Pilares: Estratégia, Dados, Ferramentas, Processos, Pessoas, Governança
 * Escala: 1 (iniciante) a 5 (líder)
 * Saída: estágio por área e pilar + recomendações práticas com foco em
 * eficiência, redução de custo e crescimento (áreas não exploradas).
 */

// ====== Tipos ======
export type Area = "Vendas" | "Pré‑Vendas" | "CS";
export type Pilar = "Estratégia" | "Dados" | "Ferramentas" | "Processos" | "Pessoas" | "Governança";

interface Question {
  id: string;
  area: Area;
  pilar: Pilar;
  text: string;
  weight?: number; // default 1
}

// ====== Banco de Perguntas ======
const QUESTIONS: Question[] = [
  // VENDAS
  { id: "V-E-1", area: "Vendas", pilar: "Estratégia", text: "Temos ICP (perfil de cliente ideal) documentado e revisado trimestralmente.", weight: 1.2 },
  { id: "V-D-1", area: "Vendas", pilar: "Dados", text: "Acompanhamos funil completo (taxas por etapa) com metas semanais." },
  { id: "V-F-1", area: "Vendas", pilar: "Ferramentas", text: "CRM está padronizado e 90%+ das negociações são registradas nele." },
  { id: "V-P-1", area: "Vendas", pilar: "Processos", text: "Existe playbook de vendas com critérios claros de passagem de etapa (exit-criteria)." },
  { id: "V-Pe-1", area: "Vendas", pilar: "Pessoas", text: "Onboarding de vendedores com ramp‑up previsto e trilha de treinamento contínuo." },
  { id: "V-G-1", area: "Vendas", pilar: "Governança", text: "Rotina de forecast semanal com revisão de pipeline e acurácia histórica >70%." },
  { id: "V-D-2", area: "Vendas", pilar: "Dados", text: "Usamos benchmarks de conversão por indústria e ticket para calibrar metas." },
  { id: "V-F-2", area: "Vendas", pilar: "Ferramentas", text: "Integrações: CRM ↔ automação de prospecção (LinkedIn/WhatsApp) ↔ BI estão ativas." },

  // PRÉ‑VENDAS
  { id: "P-E-1", area: "Pré‑Vendas", pilar: "Estratégia", text: "Temos SLA de qualificação (tempo/resposta, critérios BANT/GPCT ou similar)." },
  { id: "P-D-1", area: "Pré‑Vendas", pilar: "Dados", text: "Taxas de contato, conexão e qualificação são medidas por canal (email, LinkedIn, WhatsApp, telefone)." },
  { id: "P-F-1", area: "Pré‑Vendas", pilar: "Ferramentas", text: "Cadências multicanal (mensagens/tempos) estão padronizadas e testadas A/B." },
  { id: "P-P-1", area: "Pré‑Vendas", pilar: "Processos", text: "Handoff para vendas com contexto completo (dor, urgência, próximo passo)." },
  { id: "P-Pe-1", area: "Pré‑Vendas", pilar: "Pessoas", text: "Playbook de cold outreach com scripts e objeções mapeadas." },
  { id: "P-G-1", area: "Pré‑Vendas", pilar: "Governança", text: "Revisões quinzenais de cadências com métricas e backlog de hipóteses." },

  // CS
  { id: "C-E-1", area: "CS", pilar: "Estratégia", text: "Jornadas por segmento (onboarding→adoção→expansão→renovação) estão definidas." },
  { id: "C-D-1", area: "CS", pilar: "Dados", text: "NPS, CES e health score por conta são acompanhados e acionáveis." },
  { id: "C-F-1", area: "CS", pilar: "Ferramentas", text: "Ferramenta de CS/CRM registra planos de sucesso, QBRs e riscos com alertas." },
  { id: "C-P-1", area: "CS", pilar: "Processos", text: "Existe rito de prevenção de churn e playbook de expansão (upsell/cross)." },
  { id: "C-Pe-1", area: "CS", pilar: "Pessoas", text: "Time com metas híbridas (retensão + expansão) e trilha de boas práticas." },
  { id: "C-G-1", area: "CS", pilar: "Governança", text: "Comitê mensal de clientes (riscos, causas, ações e owners) com ata e prazos." },

  // CROSS
  { id: "X-D-1", area: "Vendas", pilar: "Dados", text: "Temos um BI/scorecard 360º que consolida dados de marketing, pré‑vendas, vendas e CS.", weight: 1.2 },
  { id: "X-F-1", area: "Pré‑Vendas", pilar: "Ferramentas", text: "Automação de prospecção no LinkedIn e WhatsApp com segmentação por ICP e copy light." },
  { id: "X-P-1", area: "CS", pilar: "Processos", text: "SLA entre áreas e responsabilidade por etapas estão claras e documentadas." },
];

// ====== Utilidades ======
const AREAS: Area[] = ["Vendas", "Pré‑Vendas", "CS"];
const PILARES: Pilar[] = ["Estratégia", "Dados", "Ferramentas", "Processos", "Pessoas", "Governança"];

const STAGES = [
  { name: "Iniciante", min: 0, max: 1.9 },
  { name: "Emergente", min: 2.0, max: 2.9 },
  { name: "Estruturado", min: 3.0, max: 3.6 },
  { name: "Avançado", min: 3.7, max: 4.4 },
  { name: "Líder", min: 4.5, max: 5.0 },
] as const;

function scoreToStage(score: number) {
  return STAGES.find((s) => score >= s.min && score <= s.max)?.name ?? "—";
}

// Recomendações por pilar (enxutas e acionáveis)
const RECS: Record<Pilar, { eficiencia: string; custo: string; crescimento: string }[]> = {
  "Estratégia": [
    {
      eficiencia: "Refinar ICP por dados de win/loss e tickets; priorize 3 segmentos top.",
      custo: "Cortar canais com CAC alto e LTV baixo; foque nos 2 melhores clusters.",
      crescimento: "Criar ofertas de entrada (land) e pacotes de expansão (expand).",
    },
  ],
  "Dados": [
    {
      eficiencia: "Definir métricas por etapa e alertas de gargalo (lead→MQL→SQL→Win).",
      custo: "Automatizar coleta via CRM/BI para reduzir horas operacionais.",
      crescimento: "Modelos de propensão simples para priorizar contas com maior fit.",
    },
  ],
  "Ferramentas": [
    {
      eficiencia: "Integração CRM↔automação (LinkedIn/WhatsApp) para evitar retrabalho.",
      custo: "Consolidar stack, eliminar redundâncias e negociar licenças.",
      crescimento: "Ativar cadências multicanal e enriquecimento de leads por ICP.",
    },
  ],
  "Processos": [
    {
      eficiencia: "Formalizar playbooks e SLAs com exit-criteria por etapa.",
      custo: "Padronizar templates de emails/mensagens e evitar personalização excessiva.",
      crescimento: "Roteiros de upsell/cross e QBRs com plano de valor conjunto.",
    },
  ],
  "Pessoas": [
    {
      eficiencia: "Onboarding com shadowing e biblioteca de objeções.",
      custo: "Treinamentos curtos on-demand; mentoria interna entre pares.",
      crescimento: "Metas por cohort (ramp-up) e bônus atrelados a expansão/retensão.",
    },
  ],
  "Governança": [
    {
      eficiencia: "Ritos semanais (pipeline/forecast) e mensais (comitê de clientes).",
      custo: "Dono claro por KPI; evitar reuniões sem pauta e sem decisão.",
      crescimento: "Roadmap trimestral de hipóteses, testes A/B e lições aprendidas.",
    },
  ],
};

// ====== Armazenamento local ======
const STORAGE_KEY = "prospera-maturity-calculator";

function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [state, key]);
  return [state, setState] as const;
}

// ====== Componente Principal ======
export default function ProsperaMaturityCalculator() {
  const [org, setOrg] = usePersistentState("org", "");
  const [contact, setContact] = usePersistentState("contact", "");

  const initialAnswers = useMemo(() => {
    const obj: Record<string, number> = {};
    QUESTIONS.forEach((q) => (obj[q.id] = 0));
    return obj;
  }, []);

  const [answers, setAnswers] = usePersistentState<Record<string, number>>(STORAGE_KEY, initialAnswers);

  const answeredCount = Object.values(answers).filter((v) => v > 0).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  // Cálculo de scores por pilar e por área
  const { byPilar, byArea, overall } = useMemo(() => {
    const pilarAgg: Record<Pilar, { sum: number; w: number }> = Object.fromEntries(
      PILARES.map((p) => [p, { sum: 0, w: 0 }])
    ) as any;

    const areaAgg: Record<Area, { sum: number; w: number }> = Object.fromEntries(
      AREAS.map((a) => [a, { sum: 0, w: 0 }])
    ) as any;

    QUESTIONS.forEach((q) => {
      const val = answers[q.id] || 0;
      if (!val) return;
      const w = q.weight ?? 1;
      pilarAgg[q.pilar].sum += val * w;
      pilarAgg[q.pilar].w += w;
      areaAgg[q.area].sum += val * w;
      areaAgg[q.area].w += w;
    });

    const byPilar = Object.fromEntries(
      PILARES.map((p) => [p, pilarAgg[p].w ? +(pilarAgg[p].sum / pilarAgg[p].w).toFixed(2) : 0])
    ) as Record<Pilar, number>;

    const byArea = Object.fromEntries(
      AREAS.map((a) => [a, areaAgg[a].w ? +(areaAgg[a].sum / areaAgg[a].w).toFixed(2) : 0])
    ) as Record<Area, number>;

    const overall = +(Object.values(byPilar).reduce((s, v) => s + (v || 0), 0) / PILARES.length).toFixed(2);

    return { byPilar, byArea, overall };
  }, [answers]);

  const radarData = useMemo(() => {
    return PILARES.map((p) => ({ pilar: p, score: byPilar[p] || 0 }));
  }, [byPilar]);

  function setAnswer(id: string, value: number) {
    setAnswers({ ...answers, [id]: value });
  }

  function resetAll() {
    setAnswers(initialAnswers);
  }

  function exportCSV() {
    const headers = ["Org", "Contato", "Área", "Pilar", "Pergunta", "Valor"];
    const rows: string[] = [];
    QUESTIONS.forEach((q) => {
      rows.push([
        `"${org}"`,
        `"${contact}"`,
        q.area,
        q.pilar,
        `"${q.text.replace(/"/g, '""')}"`,
        String(answers[q.id] || 0),
      ].join(","));
    });
    const blob = new Blob([[headers.join(",") ,"\n", rows.join("\n")].join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospera_maturidade_${org || "empresa"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const lowPillars = useMemo(() => {
    return PILARES.filter((p) => byPilar[p] > 0 && byPilar[p] < 3.0);
  }, [byPilar]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Maturidade Digital no Comercial</h1>
        <p className="text-muted-foreground">Prospera Super • Avalie Vendas, Pré‑Vendas e Customer Success e receba um plano de ação.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="org">Empresa</Label>
            <Input id="org" placeholder="Ex.: Indústria XYZ" value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="contact">Seu nome ou email</Label>
            <Input id="contact" placeholder="Ex.: Ana (ana@empresa.com)" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <Button variant="secondary" onClick={resetAll}><RefreshCw className="w-4 h-4 mr-2"/>Reiniciar respostas</Button>
            <Button onClick={exportCSV}><Download className="w-4 h-4 mr-2"/>Exportar CSV</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>Progresso</CardTitle>
          <div className="flex items-center gap-3">
            <Progress value={progress} className="w-full" />
            <Badge variant="secondary">{progress}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {AREAS.map((a) => (
              <div key={a} className="p-4 rounded-2xl border">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{a}</h3>
                  <Badge>{byArea[a] ? `${byArea[a]}/5` : "—"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Estágio: {byArea[a] ? scoreToStage(byArea[a]) : "—"}</p>
              </div>
            ))}
            <div className="p-4 rounded-2xl border">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">Geral</h3>
                <Badge>{overall ? `${overall}/5` : "—"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Estágio: {overall ? scoreToStage(overall) : "—"}</p>
            </div>
          </div>

          <div className="h-80 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid />
                <PolarAngleAxis dataKey="pilar" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar dataKey="score" name="Score" />
                <Tooltip formatter={(v: number) => `${v}/5`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Perguntas */}
      <section className="space-y-6">
        {AREAS.map((area) => (
          <Card key={area} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{area}</span>
                <span className="text-sm text-muted-foreground">Score: {byArea[area] ? `${byArea[area]}/5 • ${scoreToStage(byArea[area])}` : "—"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {QUESTIONS.filter((q) => q.area === area).map((q) => (
                <div key={q.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{q.text}</p>
                      <p className="text-xs text-muted-foreground">Pilar: {q.pilar} {q.weight && q.weight !== 1 ? `• peso ${q.weight}` : ""}</p>
                    </div>
                    <Badge variant="outline">{answers[q.id] || 0}/5</Badge>
                  </div>
                  <div className="mt-3">
                    <Slider
                      value={[answers[q.id] || 0]}
                      min={0}
                      max={5}
                      step={1}
                      className="pointer-events-auto relative z-10"
                      onValueChange={(v) => setAnswer(q.id, v[0] || 0)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span>
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Prioritárias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lowPillars.length === 0 ? (
            <p className="text-muted-foreground">Responda às perguntas para ver recomendações personalizadas por pilar.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {lowPillars.map((p) => (
                <div key={p} className="border rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p}</h3>
                    <Badge variant="secondary">{byPilar[p]}/5</Badge>
                  </div>
                  {RECS[p].map((r, i) => (
                    <div key={i} className="text-sm">
                      <p><strong>Eficiência:</strong> {r.eficiencia}</p>
                      <p><strong>Custo:</strong> {r.custo}</p>
                      <p><strong>Crescimento:</strong> {r.crescimento}</p>
                    </div>
                  ))}
                  <Separator />
                  <p className="text-xs text-muted-foreground">Sugestões alinhadas às soluções Prospera Super (automação LinkedIn/WhatsApp, CRM, BI, playbooks e mentoria).</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-muted/40">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl">
          <div>
            <h3 className="font-semibold text-lg">Quer um diagnóstico guiado?</h3>
            <p className="text-sm text-muted-foreground">Agende uma sessão para transformar as recomendações em um plano de 90 dias com metas, ritos e owners.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg"><Share2 className="w-4 h-4 mr-2"/>Gerar resumo</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Resumo para {org || "sua empresa"}</DialogTitle>
              </DialogHeader>
              <Summary org={org} contact={contact} byArea={byArea} byPilar={byPilar} overall={overall} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <footer className="text-center text-xs text-muted-foreground pb-8">
        © {new Date().getFullYear()} Prospera Super – Maturidade Digital no Comercial
      </footer>
    </div>
  );
}

function Summary({ org, contact, byArea, byPilar, overall }: { org: string; contact: string; byArea: Record<Area, number>; byPilar: Record<Pilar, number>; overall: number; }) {
  const stage = scoreToStage(overall || 0);
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-2xl p-4">
          <p className="text-sm"><strong>Empresa:</strong> {org || "—"}</p>
          <p className="text-sm"><strong>Contato:</strong> {contact || "—"}</p>
          <p className="text-sm"><strong>Geral:</strong> {overall ? `${overall}/5 • ${stage}` : "—"}</p>
        </div>
        <div className="border rounded-2xl p-4">
          {AREAS.map((a) => (
            <p key={a} className="text-sm flex items-center justify-between">
              <span><strong>{a}:</strong></span>
              <span>{byArea[a] ? `${byArea[a]}/5 • ${scoreToStage(byArea[a])}` : "—"}</span>
            </p>
          ))}
        </div>
      </div>
      <Separator />
      <div className="grid md:grid-cols-3 gap-3">
        {PILARES.map((p) => (
          <div key={p} className="border rounded-2xl p-3">
            <p className="text-sm flex items-center justify-between"><span>{p}</span><span>{byPilar[p] || 0}/5</span></p>
            <p className="text-xs text-muted-foreground">Estágio: {byPilar[p] ? scoreToStage(byPilar[p]) : "—"}</p>
          </div>
        ))}
      </div>
      <Separator />
      <p className="text-xs text-muted-foreground">Dica: priorize 2 pilares com menor score para ganhos rápidos (quick wins) em 90 dias.</p>
    </div>
  );
}
