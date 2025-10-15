import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ComentariosProduto } from "@/pages/ComentariosProduto";

/** ===== (Opcional) Imagens ===== */
const quizImgs = import.meta.glob("@/assets/quiz_1/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
function getImg(file: string) {
  for (const p in quizImgs) if (p.endsWith("/" + file)) return quizImgs[p];
  return undefined;
}

/** ===== Tipos ===== */
type Letter = "A" | "B" | "C" | "D";
type Option = { letter: Letter; label: string };
type Question = { id: string; title: string; imageUrl?: string; options: Option[] };

/** ===== Pontuação ===== */
const SCORE: Record<Letter, number> = { A: 1, B: 1, C: 1, D: 0 };

/** ===== Perguntas ===== */
const QUESTIONS: Question[] = [
  { id: "q1", title: "Com que frequência você sente o coração acelerado ou aperto no peito sem motivo aparente?", imageUrl: "pgt17.png",
    options: [
      { letter: "A", label: "Raramente ou nunca" },
      { letter: "B", label: "Às vezes (1–2x por semana)" },
      { letter: "C", label: "Frequentemente (3–4x por semana)" },
      { letter: "D", label: "Quase todos os dias" },
    ]},
  { id: "q2", title: "Você evita situações sociais ou compromissos por medo/ansiedade?", imageUrl: "pgt2.png",
    options: [
      { letter: "A", label: "Não, nunca evito" },
      { letter: "B", label: "Raramente" },
      { letter: "C", label: "Algumas vezes" },
      { letter: "D", label: "Frequentemente evito" },
    ]},
  { id: "q3", title: "Ao pensar no futuro, qual sentimento predomina?", imageUrl: "pgt3.png",
    options: [
      { letter: "A", label: "Otimismo/expectativa positiva" },
      { letter: "B", label: "Neutro, sem grandes emoções" },
      { letter: "C", label: "Preocupação moderada" },
      { letter: "D", label: "Medo intenso/pensamentos catastróficos" },
    ]},
  { id: "q4", title: "Sua mente fica acelerada e é difícil relaxar?", imageUrl: "pgt4.png",
    options: [
      { letter: "A", label: "Não, relaxo com facilidade" },
      { letter: "B", label: "Às vezes tenho dificuldade" },
      { letter: "C", label: "Frequentemente minha mente não para" },
      { letter: "D", label: "Quase sempre, é exaustivo" },
    ]},
  { id: "q5", title: "A ansiedade tem impactado sua qualidade de vida, trabalho ou relacionamentos?", imageUrl: "pgt5.png",
    options: [
      { letter: "A", label: "Não, é controlável" },
      { letter: "B", label: "Impacta levemente às vezes" },
      { letter: "C", label: "Impacta moderadamente" },
      { letter: "D", label: "Impacta severamente" },
    ]},
  { id: "q6", title: "Você acredita que técnicas naturais (respiração, meditação) ajudam a controlar a ansiedade?", imageUrl: "pgt6.png",
    options: [
      { letter: "A", label: "Não acredito" },
      { letter: "B", label: "Talvez ajudem um pouco" },
      { letter: "C", label: "Sim, podem ajudar" },
      { letter: "D", label: "Com certeza, já vi resultados" },
    ]},
  { id: "q7", title: "Você se comprometeria a praticar 15–20 min/dia de exercícios anti-ansiedade?", imageUrl: "pgt7.png",
    options: [
      { letter: "A", label: "Não tenho tempo/interesse" },
      { letter: "B", label: "Talvez, se for simples" },
      { letter: "C", label: "Sim, estou disposto(a)" },
      { letter: "D", label: "Sim, e estou comprometido(a)" },
    ]},
  { id: "q8", title: "Mudanças de estilo de vida podem reduzir significativamente a ansiedade?", imageUrl: "pgt8.png",
    options: [
      { letter: "A", label: "Não, acho que é só genético" },
      { letter: "B", label: "Talvez tenham algum efeito" },
      { letter: "C", label: "Sim, ajudam bastante" },
      { letter: "D", label: "Totalmente, são fundamentais" },
    ]},
  { id: "q9", title: "Você já tentou abordagens naturais (chás, exercícios, meditação)?", imageUrl: "pgt9.png",
    options: [
      { letter: "A", label: "Nunca tentei" },
      { letter: "B", label: "Tentei, mas sem consistência" },
      { letter: "C", label: "Sim, e ajudou um pouco" },
      { letter: "D", label: "Sim, funciona quando pratico" },
    ]},
  { id: "q10", title: "Você precisa de um guia passo a passo para lidar com sua ansiedade?", imageUrl: "pgt10.png",
    options: [
      { letter: "A", label: "Não, prefiro descobrir sozinho(a)" },
      { letter: "B", label: "Talvez ajudasse" },
      { letter: "C", label: "Sim, seria muito útil" },
      { letter: "D", label: "Sim, preciso urgentemente" },
    ]},
];

/** ===== Resultado ===== */
function resultFromScore(total: number) {
  if (total <= 17) {
    return {
      title: "Ansiedade Elevada",
      desc: "Seus sinais indicam ansiedade significativa no dia a dia. Com orientação clara e práticas simples, você pode reduzir sintomas rapidamente.",
      color: "text-red-600",
    };
  }
  if (total <= 19) {
    return {
      title: "Ansiedade Moderada",
      desc: "Existem fatores que estão alimentando sua ansiedade. Com ajustes práticos e um plano guiado, a melhora é consistente.",
      color: "text-yellow-300",
    };
  }
  return {
    title: "Ansiedade Leve",
    desc: "Você tem uma base razoável. Com pequenas práticas, dá para estabilizar ainda mais seu emocional e prevenir recaídas.",
    color: "text-yellow-300",
  };
}

/** ===== Página ===== */
export default function QuizAnsiedade() {
  const [answers, setAnswers] = useState<Record<string, Letter | undefined>>({});
  const [step, setStep] = useState(0);
  const [tapping, setTapping] = useState<Letter | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Banner fixo de urgência (só na tela final)
  const [countdown, setCountdown] = useState(7 * 68); // 7 min 50 aprox.
  const [slots, setSlots] = useState(5); // começa com 5, cai até 1

  useEffect(() => {
    if (!submitted) return;
    // Timer mm:ss
    const t = setInterval(() => {
      setCountdown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    // Queda de vagas a cada 60s até mínimo 1
    const d = setInterval(() => {
      setSlots((n) => Math.max(1, n - 1));
    }, 60000);

    return () => {
      clearInterval(t);
      clearInterval(d);
    };
  }, [submitted]);

  const current = QUESTIONS[step];

  const total = useMemo(
    () => QUESTIONS.reduce((acc, q) => acc + (answers[q.id] ? SCORE[answers[q.id] as Letter] : 0), 0),
    [answers]
  );

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

  const waHref =
    "https://wa.me/551935189471?text=" + encodeURIComponent("Quero reduzir minha ansiedade");

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
  };

  const QuestionCard = () => {
    const src = current.imageUrl ? getImg(current.imageUrl) : undefined;
    return (
      <Card className="bg-card/70 shadow-soft h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{current.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* imagem centralizada, sem corte; máx. 512px de altura */}
          <div className="w-full rounded-xl bg-muted/40 border border-border overflow-hidden">
            <div className="grid place-items-center p-2">
              {src ? (
                <img
                  src={src}
                  alt=""
                  className="max-w-full object-contain max-h-[512px]"
                  loading="lazy"
                />
              ) : (
                <div className="h-[240px] w-full grid place-items-center text-muted-foreground text-sm">
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

          {/* voltar */}
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
  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  const ResultCard = () => (
    <Card className="bg-card/70 border-transparent shadow-glow w-full max-w-2xl md:max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className={cn("text-2xl md:text-3xl", res.color)}>
          {res.title} — Pontuação: {total} / 20
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 md:gap-7 text-center">
        <p className="text-muted-foreground max-w-prose">{res.desc}</p>

        <div className="rounded-xl border border-border p-4 bg-card/70 w-full">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Como podemos ajudar agora</h3>
          <ul className="space-y-1 text-sm md:text-base md:grid md:gap-2 md:justify-items-center">
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Plano de 7 dias
              </span>{" "}
              para reduzir a ansiedade com passos simples e guiados.
            </li>
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Exercícios guiados
              </span>{" "}
              de respiração e relaxamento para crises e prevenção.
            </li>
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Receitas
              </span>{" "}
              naturais calmantes (chás e bebidas funcionais).
            </li>
            <li className="max-w-prose">
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Conteúdo de valor
              </span>{" "}
              prático, direto e fácil de aplicar no dia a dia.
            </li>
          </ul>
        </div>

        {/* CTA WhatsApp */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-3",
            "text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "bg-[linear-gradient(90deg,#25D366_0%,#128C7E_100%)] hover:brightness-110",
            "shadow-glow mx-auto"
          )}
        >
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5 shrink-0 -translate-y-[1px]" fill="currentColor">
            <path d="M19.11 17.3c-.27-.14-1.6-.79-1.84-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.2-1.37-.81-.72-1.35-1.6-1.51-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.44-.46-.62-.46-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.85.14.18 1.95 2.98 4.73 4.15.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32zM16.02 3.2c-7.1 0-12.87 5.77-12.87 12.87 0 2.27.6 4.5 1.74 6.45L3 29l6.65-1.74a12.83 12.83 0 0 0 6.37 1.67h.01c7.1 0 12.87-5.77 12.87-12.87 0-3.44-1.34-6.67-3.78-9.1a12.82 12.82 0 0 0-9.1-3.78zm0 23.49h-.01a10.6 10.6 0 0 1-5.39-1.48l-.39-.23-3.97 1.04 1.06-3.87-.25-.4a10.63 10.63 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.64-10.63 2.85 0 5.53 1.11 7.54 3.12 2.01 2.01 3.11 4.69 3.11 7.54 0 5.86-4.77 10.63-10.62 10.63z"/>
          </svg>
          <span className="leading-none">Quero reduzir minha ansiedade</span>
        </a>

        {/* ===== Comentários com fotos e paginação ===== */}
        <ComentariosProduto tema="ansiedade" />
      </CardContent>
    </Card>
  );

  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  return (
    <>
      <style>{`
        @keyframes press { 0% { transform: scale(1) } 50% { transform: scale(.97) } 100% { transform: scale(1) } }
        .animate-press { animation: press .22s ease-out both; }
        @keyframes flashBg { 0% { box-shadow:0 0 0 0 hsl(264 65% 60% / 0) }
          50% { box-shadow:0 0 24px 0 hsl(264 65% 60% / .35) }
          100% { box-shadow:0 0 0 0 hsl(264 65% 60% / 0) } }
        .flash { animation: flashBg .22s ease-out both; }
      `}</style>

      {/* ===== Banner fixo no topo (apenas quando submitted) ===== */}
      {submitted && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white font-bold text-sm md:text-base">
          <div className="mx-auto max-w-[1000px] px-3 py-2 text-center">
            ⚠️ Últimas vagas: {slots} • prioridade expira em{" "}
            <span className="tabular-nums underline">{String(Math.floor(countdown/60)).padStart(2,"0")}:
              {String(countdown%60).padStart(2,"0")}
            </span> — fale com nossa equipe no WhatsApp.
          </div>
        </div>
      )}

      <div className={cn(
        "min-h-[100svh] w-full overflow-hidden bg-gradient-calm flex flex-col p-4",
        submitted ? "pt-10" : "" // espaço para o banner fixo
      )}>
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
            <div className="min-h-[70svh] md:min-h-[100svh] flex items-center justify-center">
              <ResultCard />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
