import { useEffect, useMemo, useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ComentariosProduto } from "@/pages/ComentariosProduto";

/** ===== Pixel helper (TS-safe) ===== */
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}
function trackWhatsAppClick(payload: Record<string, any> = {}) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", "WhatsAppClick", {
      event_source: "quiz",
      ...payload,
    });
  }
}

/** ===== Utils ===== */
function getParam(name: string) {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || "";
  } catch {
    return "";
  }
}

/** ===== (Opcional) Imagens — crie src/assets/quiz_1/*.png ===== */
const quizImgs = import.meta.glob("@/assets/quiz_1/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function getImg(file: string) {
  for (const p in quizImgs) {
    if (p.endsWith("/" + file)) return quizImgs[p];
  }
  return undefined;
}

/** ===== Tipos ===== */
type Letter = "A" | "B" | "C" | "D";
type Option = { letter: Letter; label: string };
type Question = { id: string; title: string; imageUrl?: string; options: Option[] };

/** ===== Pontuação (0–10, 0 = pior, 10 = melhor) ===== */
const SCORE: Record<Letter, number> = { A: 1, B: 1, C: 1, D: 0 };

/** ===== Perguntas (10) =====
 * Ordem pensada para: Dor (q1–q5) → Concordância (q6–q8) → Solução/CTA (q9–q10)
 */
const QUESTIONS: Question[] = [
  // ——— DOR / TOMADA DE CONSCIÊNCIA ———
  {
    id: "q1",
    title: "Você sente que sua mente não desliga, mesmo quando tenta relaxar ou dormir?",
    imageUrl: "pgt5.png",
    options: [
      { letter: "A", label: "Raramente, consigo relaxar facilmente" },
      { letter: "B", label: "Às vezes tenho dificuldade" },
      { letter: "C", label: "Frequentemente minha mente acelera" },
      { letter: "D", label: "Sempre, é impossível desligar os pensamentos" },
    ],
  },
  {
    id: "q2",
    title: "Com que frequência você passa a noite acordado(a) pensando em preocupações?",
    imageUrl: "pgt8.png",
    options: [
      { letter: "A", label: "Nunca ou raramente" },
      { letter: "B", label: "1–2 vezes por semana" },
      { letter: "C", label: "3–4 vezes por semana" },
      { letter: "D", label: "Quase todas as noites" },
    ],
  },
  {
    id: "q3",
    title: "Ao longo do dia, você se sente cansado(a) mas à noite não consegue dormir?",
    imageUrl: "pgt16.png",
    options: [
      { letter: "A", label: "Não, durmo normalmente quando estou cansado(a)" },
      { letter: "B", label: "Às vezes acontece" },
      { letter: "C", label: "Frequentemente me sinto assim" },
      { letter: "D", label: "Sempre! Exausto(a) e sem sono" },
    ],
  },
  {
    id: "q4",
    title: "Sintomas físicos (coração acelerado, tensão muscular, sudorese) acontecem com você?",
    imageUrl: "pgt19.png",
    options: [
      { letter: "A", label: "Raramente ou nunca" },
      { letter: "B", label: "Ocasionalmente" },
      { letter: "C", label: "Frequentemente sinto" },
      { letter: "D", label: "Diariamente; é muito desconfortável" },
    ],
  },
  {
    id: "q5",
    title: "Como ansiedade e falta de sono têm impactado sua vida (trabalho, relacionamentos, saúde)?",
    imageUrl: "pgt15.png",
    options: [
      { letter: "A", label: "Pouco ou nenhum impacto" },
      { letter: "B", label: "Impacto leve ocasional" },
      { letter: "C", label: "Impacto moderado frequente" },
      { letter: "D", label: "Impacto severo em várias áreas" },
    ],
  },

  // ——— CONCORDÂNCIA / ALINHAMENTO ———
  {
    id: "q6",
    title: "Você acredita que ansiedade e insônia estão conectadas e se retroalimentam?",
    imageUrl: "pgt5.png",
    options: [
      { letter: "A", label: "Não vejo conexão" },
      { letter: "B", label: "Talvez haja relação" },
      { letter: "C", label: "Sim; uma piora a outra" },
      { letter: "D", label: "Totalmente; é um ciclo vicioso" },
    ],
  },
  {
    id: "q7",
    title: "Tratar ansiedade e sono ao mesmo tempo seria mais eficaz para você?",
    imageUrl: "pgt4.png",
    options: [
      { letter: "A", label: "Não acho necessário" },
      { letter: "B", label: "Talvez seja útil" },
      { letter: "C", label: "Sim; faz sentido tratar junto" },
      { letter: "D", label: "Com certeza; preciso abordagem integrada" },
    ],
  },
  {
    id: "q8",
    title: "Você conseguiria dedicar 20 minutos por dia para práticas que melhorem ansiedade e sono?",
    imageUrl: "pgt3.png",
    options: [
      { letter: "A", label: "Não tenho tempo" },
      { letter: "B", label: "Talvez ocasionalmente" },
      { letter: "C", label: "Sim; posso me organizar" },
      { letter: "D", label: "Sim; totalmente comprometido(a)" },
    ],
  },

  // ——— SOLUÇÃO / PRONTO PARA AGIR ———
  {
    id: "q9",
    title: "Você sente que precisa de um programa integrado (passo a passo) para ansiedade e sono?",
    imageUrl: "pgt12.png",
    options: [
      { letter: "A", label: "Não preciso disso" },
      { letter: "B", label: "Talvez fosse interessante" },
      { letter: "C", label: "Sim; seria muito útil" },
      { letter: "D", label: "Sim; é exatamente o que preciso" },
    ],
  },
  {
    id: "q10",
    title: "Você está pronto(a) para quebrar o ciclo de ansiedade e insônia e recuperar sua qualidade de vida?",
    imageUrl: "pgt3.png",
    options: [
      { letter: "A", label: "Não estou pronto(a) agora" },
      { letter: "B", label: "Estou considerando" },
      { letter: "C", label: "Sim; quero começar em breve" },
      { letter: "D", label: "Sim; quero transformar agora!" },
    ],
  },
];

/** ===== Resultado por pontuação (0–10) ===== */
function resultFromScore(total: number) {
  if (total <= 6) {
    return {
      title: "Situação Crítica",
      desc:
        "Sinais fortes de ansiedade e/ou insônia. Um plano integrado com técnicas simples e acompanhamento pode acelerar sua virada.",
      color: "text-red-600",
    };
  }
  if (total <= 8) {
    return {
      title: "Situação Moderada",
      desc:
        "Há fatores importantes alimentando o ciclo ansiedade–insônia. Ajustes práticos com um roteiro guiado já trazem melhora consistente.",
      color: "text-yellow-300",
    };
  }
  return {
    title: "Situação Leve",
    desc:
      "Boa base para estabilizar. Práticas rápidas e regulares ajudam a prevenir recaídas e consolidar noites melhores.",
    color: "text-yellow-300",
  };
}

/** ===== Componentes extraídos (estáveis) ===== */
const OptionBtn = memo(function OptionBtn({
  opt,
  active,
  isTapped,
  onChoose,
}: {
  opt: Option;
  active: boolean;
  isTapped: boolean;
  onChoose: (l: Letter) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChoose(opt.letter)}
      className={cn(
        "w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        active ? "border-primary bg-primary/10 ring-2 ring-primary" : "border-border hover:shadow-soft",
        isTapped && "animate-press flash [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      aria-label={`Opção ${opt.letter}: ${opt.label}`}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 font-semibold">
          {opt.letter}
        </span>
        <span className="pt-0.5">{opt.label}</span>
      </div>
    </button>
  );
});

const QuestionCard = memo(function QuestionCard({
  question,
  currentAnswer,
  tapping,
  onChoose,
  onBack,
  canBack,
}: {
  question: Question;
  currentAnswer?: Letter;
  tapping: Letter | null;
  onChoose: (l: Letter) => void;
  onBack: () => void;
  canBack: boolean;
}) {
  const src = question.imageUrl ? getImg(question.imageUrl) : undefined;
  return (
    <Card className="bg-card/70 shadow-soft h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base md:text-lg">{question.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="w-full rounded-xl bg-muted/40 border border-border overflow-hidden">
          <div className="grid place-items-center p-2">
            {src ? (
              <img
                src={src}
                alt=""
                className="max-w-full object-contain max-h-[512px]"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            ) : (
              <div className="h-[240px] w-full grid place-items-center text-muted-foreground text-sm">
                Espaço para imagem
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {question.options.map((opt) => (
            <OptionBtn
              key={opt.letter}
              opt={opt}
              active={currentAnswer === opt.letter}
              isTapped={tapping === opt.letter}
              onChoose={onChoose}
            />
          ))}
        </div>

        <div className="mt-auto pt-2">
          <Button variant="secondary" onClick={onBack} disabled={!canBack}>
            Voltar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

const ResultCard = memo(function ResultCard({
  total,
  waHref,
}: {
  total: number;
  waHref: string;
}) {
  const res = resultFromScore(total);

  return (
    <Card className="bg-card/70 border-transparent shadow-glow w-full max-w-2xl md:max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className={cn("text-2xl md:text-3xl", res.color)}>
          {res.title} — Pontuação: {total} / 10
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 md:gap-7 text-center">
        <p className="text-muted-foreground max-w-prose">{res.desc}</p>

        <div className="rounded-xl border border-border p-4 bg-card/70 w-full">
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            Como podemos ajudar agora (abordagem integrada)
          </h3>
          <ul className="space-y-1 text-sm md:text-base md:grid md:gap-2 md:justify-items-center">
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Plano de 7 dias (Ansiedade + Sono)
              </span>{" "}
              com passos simples e guiados.
            </li>
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Exercícios guiados
              </span>{" "}
              respiração/relaxamento para crise e prevenção.
            </li>
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Receitas
              </span>{" "}
              de chás e bebidas relaxantes.
            </li>
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Conteúdo de valor
              </span>{" "}
              prático, direto e aplicável no dia a dia.
            </li>
          </ul>
        </div>

        <a
          href="/vendas"
          onClick={() => {
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "ViewContent", {
                content_name: "Página de Vendas SleepyPeepy",
                content_type: "quiz_resultado",
                value: 1,
                currency: "BRL",
              });
            }
          }}
          className={cn(
            "w-full md:w-auto inline-flex items-center justify-center rounded-2xl px-7 py-3",
            "text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-200 mx-auto animate-pulseGlow"
          )}
        >
          Quero ajuda integrada e acesso à plataforma
        </a>


        {/* ===== Avaliações / Comentários com fotos ===== */}
        <ComentariosProduto key="comentarios-misto" tema="misto" />
      </CardContent>
    </Card>
  );
});


/** ===== Página ===== */
export default function QuizMisto() {
  const [answers, setAnswers] = useState<Record<string, Letter | undefined>>({});
  const [step, setStep] = useState(0);
  const [tapping, setTapping] = useState<Letter | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Banner fixo de urgência (timer + vagas)
  const [countdown, setCountdown] = useState(7 * 68); // ~7m50s
  const [slots, setSlots] = useState(5); // decrementa até 1

  useEffect(() => {
    if (!submitted) return;
    const t = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 0)), 1000);
    const d = setInterval(() => setSlots((n) => Math.max(1, n - 1)), 60000);
    return () => {
      clearInterval(t);
      clearInterval(d);
    };
  }, [submitted]);

  const current = QUESTIONS[step];

  const total = useMemo(() => {
    const sum = QUESTIONS.reduce((acc, q) => {
      const choice = answers[q.id];
      return acc + (choice ? SCORE[choice] : 0);
    }, 0);

    // 🔒 Limita pontuação máxima a 6.5
    return sum >= 7 ? 6.5 : sum;
  }, [answers]);


  const choose = (letter: Letter) => {
    if (tapping) return;
    setAnswers((a) => ({ ...a, [current.id]: letter }));
    setTapping(letter);
    setTimeout(() => {
      setTapping(null);
      if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
      else setSubmitted(true);
    }, 260);
  };

  const back = () => step > 0 && setStep((s) => s - 1);

  // WhatsApp com fbclid opcional anexado
  const fbclid = typeof window !== "undefined" ? getParam("fbclid") : "";
  const waText =
    "Quero uma ajuda integrada para ansiedade e sono" + (fbclid ? ` (fbclid:${fbclid})` : "");
  const waHref = "https://wa.me/551935189471?text=" + encodeURIComponent(waText);

  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);
  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  /** ===== Pré-carregar as PRÓXIMAS 2 imagens quando o step muda ===== */
  useEffect(() => {
    const next1 = QUESTIONS[step + 1]?.imageUrl;
    const next2 = QUESTIONS[step + 2]?.imageUrl;
    [next1, next2]
      .map((f) => (f ? getImg(f) : undefined))
      .filter((href): href is string => Boolean(href))
      .forEach((href) => {
        const img = new Image();
        img.decoding = "async";
        img.src = href;
      });
  }, [step]);

  return (
    <>
      {/* ===== keyframes locais (press, flash, pulseGlow) ===== */}
      <style>{`
        @keyframes press {
          0% { transform: scale(1); }
          50% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
        .animate-press { animation: press 0.22s ease-out both; }

        @keyframes flashBg {
          0% { box-shadow: 0 0 0 0 hsl(264 65% 60% / 0.0); }
          50% { box-shadow: 0 0 24px 0 hsl(264 65% 60% / 0.35); }
          100% { box-shadow: 0 0 0 0 hsl(264 65% 60% / 0.0); }
        }
        .flash { animation: flashBg 0.22s ease-out both; }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.30); transform: translateZ(0) scale(1); }
          50% { box-shadow: 0 0 32px 4px rgba(37, 211, 102, 0.45); transform: translateZ(0) scale(1.02); }
        }
        .animate-pulseGlow { animation: pulseGlow 1.6s ease-in-out infinite; }
      `}</style>

      {/* ===== Banner fixo no topo (apenas quando submitted) ===== */}
      {submitted && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white font-bold text-sm md:text-base">
          <div className="mx-auto max-w-[1000px] px-3 py-2 text-center">
            ⚠️ Últimas vagas: {slots} • prioridade expira em{" "}
            <span className="tabular-nums underline">{mm}:{ss}</span> — Clique e garanta já!
          </div>
        </div>
      )}

      <div
        className={cn(
          "min-h-[100svh] w-full overflow-hidden bg-gradient-calm flex flex-col p-4",
          submitted ? "pt-10" : ""
        )}
      >
        {/* CONTAINER CENTRALIZADO E LIMITADO A 900px */}
        <div className="w-full max-w-[900px] mx-auto">
          {!submitted ? (
            <>
              <div className="mb-3">
                <Progress value={progress} />
                <div className="mt-1 text-xs text-muted-foreground">
                  {step + 1} / {QUESTIONS.length}
                </div>
              </div>
              <div className="flex-1">
                <QuestionCard
                  question={current}
                  currentAnswer={answers[current.id]}
                  tapping={tapping}
                  onChoose={choose}
                  onBack={back}
                  canBack={step > 0}
                />
              </div>
            </>
          ) : (
            <div className="min-h-[70svh] md:min_h-[100svh] flex items-center justify-center">
              <ResultCard total={total} waHref={waHref} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
