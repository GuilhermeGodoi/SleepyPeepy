import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/** ===== Imagens (src/assets/quiz_1/pgt1.png ... pgt10.png) ===== */
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

/** ===== Pontuação (0–20, 0 = pior, 20 = melhor) =====
 * A = 1, B = 1, C = 1, D = 0
 */
const SCORE: Record<Letter, number> = { A: 1, B: 1, C: 1, D: 0 };

/** ===== Perguntas ===== */
const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Quanto tempo você leva para pegar no sono?",
    imageUrl: "pgt8.png",
    options: [
      { letter: "A", label: "Menos de 15 minutos" },
      { letter: "B", label: "Entre 15 e 30 minutos" },
      { letter: "C", label: "Entre 30 minutos e 1 hora" },
      { letter: "D", label: "Mais de 1 hora" },
    ],
  },
  {
    id: "q2",
    title: "Quantas vezes você acorda durante a noite?",
    imageUrl: "pgt2.png",
    options: [
      { letter: "A", label: "Nenhuma vez" },
      { letter: "B", label: "1–2 vezes" },
      { letter: "C", label: "3–4 vezes" },
      { letter: "D", label: "Mais de 4 vezes" },
    ],
  },
  {
    id: "q3",
    title: "Como você se sente ao acordar?",
    imageUrl: "pgt3.png",
    options: [
      { letter: "A", label: "Descansado e energizado" },
      { letter: "B", label: "Razoavelmente descansado" },
      { letter: "C", label: "Ainda cansado" },
      { letter: "D", label: "Exausto e sem energia" },
    ],
  },
  {
    id: "q4",
    title: "Quantas horas você dorme por noite em média?",
    imageUrl: "pgt4.png",
    options: [
      { letter: "A", label: "7–9 horas" },
      { letter: "B", label: "6–7 horas" },
      { letter: "C", label: "5–6 horas" },
      { letter: "D", label: "Menos de 5 horas" },
    ],
  },
  {
    id: "q5",
    title: "Com que frequência você tem dificuldade para dormir?",
    imageUrl: "pgt5.png",
    options: [
      { letter: "A", label: "Nunca ou raramente" },
      { letter: "B", label: "1–2 vezes por semana" },
      { letter: "C", label: "3–4 vezes por semana" },
      { letter: "D", label: "Quase todas as noites" },
    ],
  },
  {
    id: "q6",
    title: "Você usa o celular/tablet na cama antes de dormir?",
    imageUrl: "pgt6.png",
    options: [
      { letter: "A", label: "Nunca" },
      { letter: "B", label: "Raramente (1–2x por semana)" },
      { letter: "C", label: "Às vezes (3–4x por semana)" },
      { letter: "D", label: "Sempre ou quase sempre" },
    ],
  },
  {
    id: "q7",
    title: "Você fica irritado(a) ou mal-humorado(a) facilmente?",
    imageUrl: "pgt7.png",
    options: [
      { letter: "A", label: "Nunca ou raramente" },
      { letter: "B", label: "Às vezes" },
      { letter: "C", label: "Frequentemente" },
      { letter: "D", label: "Quase sempre; qualquer coisa me irrita" },
    ],
  },
  {
    id: "q8",
    title: "Como está sua libido/desejo sexual?",
    imageUrl: "pgt8.png",
    options: [
      { letter: "A", label: "Normal e saudável" },
      { letter: "B", label: "Um pouco reduzida" },
      { letter: "C", label: "Bastante reduzida" },
      { letter: "D", label: "Praticamente inexistente" },
    ],
  },
  {
    id: "q9",
    title: "Você tem dificuldade de concentração ou esquece as coisas?",
    imageUrl: "pgt9.png",
    options: [
      { letter: "A", label: "Não; minha memória está ótima" },
      { letter: "B", label: "Às vezes me distraio" },
      { letter: "C", label: "Frequentemente esqueço coisas" },
      { letter: "D", label: "Constantemente; afeta trabalho/estudos" },
    ],
  },
  {
    id: "q10",
    title: "Seu horário de dormir é regular?",
    imageUrl: "pgt10.png",
    options: [
      { letter: "A", label: "Sim; sempre no mesmo horário" },
      { letter: "B", label: "Na maioria das vezes" },
      { letter: "C", label: "Varia bastante" },
      { letter: "D", label: "Totalmente irregular" },
    ],
  },
];

/** ===== Resultado por pontuação ===== */
function resultFromScore(total: number) {
  if (total <= 17) {
    return {
      title: "Sono comprometido",
      desc:
        "Seu padrão de sono indica dificuldades relevantes. Vamos agir agora com passos simples e guiados.",
      color: "text-red-600",
    };
  }
  if (total <= 19) {
    return {
      title: "Sono moderado",
      desc:
        "Há hábitos que estão atrapalhando seu descanso. Alguns ajustes já trazem melhora.",
      color: "text-yellow-300",
    };
  }
  return {
    title: "Sono em boa forma",
    desc:
      "Você tem uma base razoável. Pequenos aprimoramentos podem otimizar ainda mais seu sono.",
    color: "text-yellow-300",
  };
}

/** ===== Página ===== */
export default function QuizInsonia() {
  const [answers, setAnswers] = useState<Record<string, Letter | undefined>>({});
  const [step, setStep] = useState(0);
  const [tapping, setTapping] = useState<Letter | null>(null); // animação de seleção
  const [submitted, setSubmitted] = useState(false);

  const current = QUESTIONS[step];

  const total = useMemo(
    () =>
      QUESTIONS.reduce((acc, q) => {
        const choice = answers[q.id];
        return acc + (choice ? SCORE[choice] : 0);
      }, 0),
    [answers]
  );

  const choose = (letter: Letter) => {
    if (tapping) return;
    setAnswers((a) => ({ ...a, [current.id]: letter }));
    setTapping(letter);
    // anima + avança automaticamente
    setTimeout(() => {
      setTapping(null);
      if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
      else setSubmitted(true);
    }, 260);
  };

  const back = () => step > 0 && setStep((s) => s - 1);

  const waHref =
    "https://wa.me/5519993315875?text=" + encodeURIComponent("Quero dormir melhor");

  const OptionBtn = ({ opt }: { opt: Option }) => {
    const active = answers[current.id] === opt.letter;
    const isTapped = tapping === opt.letter;
    return (
      <button
        type="button"
        onClick={() => choose(opt.letter)}
        className={cn(
          "w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          active
            ? "border-primary bg-primary/10 ring-2 ring-primary"
            : "border-border hover:shadow-soft",
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
  };

  const QuestionCard = () => {
    const src = current.imageUrl ? getImg(current.imageUrl) : undefined;
    return (
      <Card className="bg-card/70 shadow-soft h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{current.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* imagem centralizada, sem corte */}
          <div className="w-full rounded-xl bg-muted/40 border border-border overflow-hidden">
            <div className="grid place-items-center aspect-[4/3] sm:aspect-[16/9] p-2">
              {src ? (
                <img
                  src={src}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-muted-foreground text-sm">
                  Espaço para imagem
                </div>
              )}
            </div>
          </div>

          {/* opções empilhadas */}
          <div className="grid grid-cols-1 gap-2">
            {current.options.map((opt) => (
              <OptionBtn key={opt.letter} opt={opt} />
            ))}
          </div>

          {/* voltar (sem avançar visível) */}
          <div className="mt-auto pt-2">
            <Button variant="secondary" onClick={back} disabled={step === 0}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const res = resultFromScore(total);

  const ResultCard = () => (
    <Card className="bg-card/70 border-transparent shadow-glow w-full max-w-3xl">
      <CardHeader>
        <CardTitle className={cn("text-2xl md:text-3xl", res.color)}>
          {res.title} — Pontuação: {total} / 20
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-muted-foreground">{res.desc}</p>

        {/* Destaques fortes */}
        <div className="rounded-xl border border-border p-4 bg-card/70 space-y-2">
          <h3 className="text-lg md:text-xl font-semibold">Como podemos ajudar agora</h3>
          <ul className="space-y-1 text-sm md:text-base">
            <li>
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Plano de 7 dias
              </span>{" "}
              para acabar com a insônia com passos simples e guiados.
            </li>
            <li>
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Exercícios guiados
              </span>{" "}
              de relaxamento para dormir mais rápido.
            </li>
            <li>
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Receitas
              </span>{" "}
              de chás e bebidas relaxantes.
            </li>
            <li>
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Conteúdo de valor
              </span>{" "}
              prático, direto e fácil de aplicar no dia a dia.
            </li>
          </ul>
        </div>

        {/* CTA WhatsApp pulsante e alinhado */}
        <div className="pt-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-3",
              "text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "bg-[linear-gradient(90deg,#25D366_0%,#128C7E_100%)] hover:brightness-110",
              "shadow-glow animate-pulseGlow"
            )}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 32 32"
              className="h-5 w-5 shrink-0 -translate-y-[1px]"
              fill="currentColor"
            >
              <path d="M19.11 17.3c-.27-.14-1.6-.79-1.84-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.2-1.37-.81-.72-1.35-1.6-1.51-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.44-.46-.62-.46-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.85.14.18 1.95 2.98 4.73 4.15.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32zM16.02 3.2c-7.1 0-12.87 5.77-12.87 12.87 0 2.27.6 4.5 1.74 6.45L3 29l6.65-1.74a12.83 12.83 0 0 0 6.37 1.67h.01c7.1 0 12.87-5.77 12.87-12.87 0-3.44-1.34-6.67-3.78-9.1a12.82 12.82 0 0 0-9.1-3.78zm0 23.49h-.01a10.6 10.6 0 0 1-5.39-1.48l-.39-.23-3.97 1.04 1.06-3.87-.25-.4a10.63 10.63 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.64-10.63 2.85 0 5.53 1.11 7.54 3.12 2.01 2.01 3.11 4.69 3.11 7.54 0 5.86-4.77 10.63-10.62 10.63z"/>
            </svg>
            <span className="leading-none">Quero dormir melhor</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );

  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

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

      <div className="min-h-[100svh] w-full overflow-hidden bg-gradient-calm flex flex-col p-4">
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
                <QuestionCard />
              </div>
            </>
          ) : (
            // Resultado centralizado verticalmente (mantendo largura máx.)
            <div className="min-h-[70svh] flex items-center justify-center">
              <ResultCard />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
