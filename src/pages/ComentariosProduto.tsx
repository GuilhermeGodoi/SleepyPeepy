// --- Comentários com fotos, 30 itens, 10 páginas (3 por página) ---
// Requer seus componentes shadcn: Button, Card, Input, Textarea (ajuste imports se necessário)
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";


type Depo = {
  id: string;
  nome: string;
  avatar: string; // URL da foto
  estrelas: number; // 1-5
  texto: string;
  quando: string; // ex.: "há 3 dias"
};

function Star({ filled, size = 16 }: { filled: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={filled ? "text-yellow-300" : "text-muted-foreground"}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.169L12 18.897l-7.336 3.868 1.402-8.169L.132 9.21l8.2-1.192L12 .587z" />
    </svg>
  );
}

function StarsStatic({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < full} size={size} />
      ))}
    </div>
  );
}

function StarsPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "p-1 rounded hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2",
            n <= value ? "text-yellow-300" : "text-muted-foreground"
          )}
          aria-label={`Dar nota ${n}`}
        >
          <Star filled={n <= value} size={16} />
        </button>
      ))}
    </div>
  );
}

// 30 depoimentos (com fotos do randomuser)
const SEED: Depo[] = [
  { id: "1",  nome: "Marina S.",   avatar: "https://randomuser.me/api/portraits/women/12.jpg", estrelas: 5,   texto: "Prático e direto. Em poucos dias já me senti mais tranquila.", quando: "há 3 dias" },
  { id: "2",  nome: "Carlos R.",   avatar: "https://randomuser.me/api/portraits/men/32.jpg",   estrelas: 5,   texto: "As técnicas de respiração me ajudaram nas crises.", quando: "há 4 dias" },
  { id: "3",  nome: "Lívia A.",    avatar: "https://randomuser.me/api/portraits/women/68.jpg", estrelas: 4,   texto: "Conteúdo objetivo, fácil de seguir.", quando: "há 5 dias" },
  { id: "4",  nome: "Paula M.",    avatar: "https://randomuser.me/api/portraits/women/22.jpg", estrelas: 5,   texto: "Voltei a dormir melhor e a ansiedade reduziu muito.", quando: "há 6 dias" },
  { id: "5",  nome: "Thiago P.",   avatar: "https://randomuser.me/api/portraits/men/71.jpg",   estrelas: 5,   texto: "Plano de 7 dias excelente, sem enrolação.", quando: "há 1 semana" },
  { id: "6",  nome: "Joana B.",    avatar: "https://randomuser.me/api/portraits/women/36.jpg", estrelas: 4,   texto: "Gostei das rotinas noturnas, funcionam mesmo.", quando: "há 1 semana" },
  { id: "7",  nome: "Renan C.",    avatar: "https://randomuser.me/api/portraits/men/3.jpg",    estrelas: 5,   texto: "Apoio simples e prático para o dia a dia.", quando: "há 1 semana" },
  { id: "8",  nome: "Fernanda V.", avatar: "https://randomuser.me/api/portraits/women/9.jpg",  estrelas: 5,   texto: "Ansiedade e sono tratados juntos = chave pra mim.", quando: "há 8 dias" },
  { id: "9",  nome: "Gustavo L.",  avatar: "https://randomuser.me/api/portraits/men/9.jpg",    estrelas: 4,   texto: "Fácil de encaixar na rotina.", quando: "há 8 dias" },
  { id: "10", nome: "Ana K.",      avatar: "https://randomuser.me/api/portraits/women/17.jpg", estrelas: 5,   texto: "Resultados rápidos, recomendo!", quando: "há 9 dias" },
  { id: "11", nome: "Lucas M.",    avatar: "https://randomuser.me/api/portraits/men/41.jpg",   estrelas: 5,   texto: "Respiração + mindfulness mudaram meu dia.", quando: "há 10 dias" },
  { id: "12", nome: "Beatriz F.",  avatar: "https://randomuser.me/api/portraits/women/41.jpg", estrelas: 5,   texto: "Dormindo melhor e mais calma.", quando: "há 10 dias" },
  { id: "13", nome: "Ricardo S.",  avatar: "https://randomuser.me/api/portraits/men/83.jpg",   estrelas: 4,   texto: "Recomendo para quem quer começar simples.", quando: "há 11 dias" },
  { id: "14", nome: "Sofia P.",    avatar: "https://randomuser.me/api/portraits/women/80.jpg", estrelas: 5,   texto: "Gostei muito das práticas guiadas.", quando: "há 12 dias" },
  { id: "15", nome: "Mateus A.",   avatar: "https://randomuser.me/api/portraits/men/28.jpg",   estrelas: 5,   texto: "Finalmente parei de rolar na cama à noite.", quando: "há 12 dias" },
  { id: "16", nome: "Camila R.",   avatar: "https://randomuser.me/api/portraits/women/45.jpg", estrelas: 5,   texto: "Organizado e motivador.", quando: "há 13 dias" },
  { id: "17", nome: "Daniel T.",   avatar: "https://randomuser.me/api/portraits/men/49.jpg",   estrelas: 5,   texto: "Simples, mas muito eficaz.", quando: "há 2 semanas" },
  { id: "18", nome: "Helena C.",   avatar: "https://randomuser.me/api/portraits/women/52.jpg", estrelas: 5,   texto: "Crises mais curtas e raras.", quando: "há 2 semanas" },
  { id: "19", nome: "Rafael D.",   avatar: "https://randomuser.me/api/portraits/men/6.jpg",    estrelas: 4,   texto: "As rotinas me ajudaram a focar.", quando: "há 2 semanas" },
  { id: "20", nome: "Patrícia N.", avatar: "https://randomuser.me/api/portraits/women/4.jpg",  estrelas: 5,   texto: "Atendimento humano e conteúdo útil.", quando: "há 2 semanas" },
  { id: "21", nome: "Otávio H.",   avatar: "https://randomuser.me/api/portraits/men/19.jpg",   estrelas: 5,   texto: "Valeu muito a pena.", quando: "há 2 semanas" },
  { id: "22", nome: "Isabela Q.",  avatar: "https://randomuser.me/api/portraits/women/20.jpg", estrelas: 5,   texto: "Dormindo mais rápido, ansiedade menor.", quando: "há 15 dias" },
  { id: "23", nome: "Marcos E.",   avatar: "https://randomuser.me/api/portraits/men/36.jpg",   estrelas: 4,   texto: "Gostei das receitas relaxantes.", quando: "há 15 dias" },
  { id: "24", nome: "Bruna W.",    avatar: "https://randomuser.me/api/portraits/women/33.jpg", estrelas: 5,   texto: "Acompanhamento fez diferença.", quando: "há 16 dias" },
  { id: "25", nome: "Felipe S.",   avatar: "https://randomuser.me/api/portraits/men/65.jpg",   estrelas: 5,   texto: "Senti melhora real na primeira semana.", quando: "há 16 dias" },
  { id: "26", nome: "Nina J.",     avatar: "https://randomuser.me/api/portraits/women/7.jpg",  estrelas: 5,   texto: "Rotinas curtas e efetivas.", quando: "há 16 dias" },
  { id: "27", nome: "Diego F.",    avatar: "https://randomuser.me/api/portraits/men/12.jpg",   estrelas: 4,   texto: "Interface simples, conteúdos bons.", quando: "há 17 dias" },
  { id: "28", nome: "Larissa M.",  avatar: "https://randomuser.me/api/portraits/women/8.jpg",  estrelas: 5,   texto: "Dormindo melhor e mais calma no dia.", quando: "há 17 dias" },
  { id: "29", nome: "Henrique O.", avatar: "https://randomuser.me/api/portraits/men/52.jpg",   estrelas: 5,   texto: "Recomendo muito!", quando: "há 18 dias" },
  { id: "30", nome: "Carolina T.", avatar: "https://randomuser.me/api/portraits/women/12.jpg", estrelas: 5,   texto: "Mudou minha rotina noturna.", quando: "há 18 dias" },
];

export function ComentariosProduto({ tema = "ansiedade" }: { tema?: "ansiedade" | "insonia" | "misto" }) {
  // 3 por página -> 10 páginas (com 30 itens)
  const POR_PAG = 5;
  const [page, setPage] = useState(1);

  // estado local para “parecer real” quando o usuário comenta
  const [items, setItems] = useState<Depo[]>(SEED);

  const paginaTotal = Math.ceil(items.length / POR_PAG);
  const ini = (page - 1) * POR_PAG;
  const fim = ini + POR_PAG;
  const visiveis = items.slice(ini, fim);

  const media = useMemo(
    () => (items.length ? items.reduce((a, b) => a + b.estrelas, 0) / items.length : 0),
    [items]
  );

  // formulário novo comentário
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [nota, setNota] = useState(5);

  const publicar = () => {
    if (!texto.trim()) return;
    const novo: Depo = {
      id: String(Date.now()),
      nome: nome.trim() || "Você",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // avatar genérico
      estrelas: nota,
      texto: texto.trim(),
      quando: "agora",
    };
    const novos = [...items, novo];
    setItems(novos);
    // ir para a última página para visualizar o comentário
    setPage(Math.ceil(novos.length / POR_PAG));
    setNome("");
    setTexto("");
    setNota(5);
  };

  return (
    <Card className="bg-card/70 border-border shadow-soft mt-6">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-xl sm:text-2xl">O que as pessoas dizem</CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{media.toFixed(1)}</span>
          <StarsStatic value={media} />
          <span>({items.length+923} avaliações)</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Lista de comentários (3 por página) */}
        <div className="space-y-3">
          {visiveis.map((d) => (
            <div key={d.id} className="rounded-lg border border-border p-3 bg-card/60">
              <div className="flex items-start gap-3">
                <img
                  src={d.avatar}
                  alt={d.nome}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="font-semibold truncate">{d.nome}</div>
                    <div className="flex items-center gap-2">
                      <StarsStatic value={d.estrelas} />
                      <span className="text-xs text-muted-foreground">{d.quando}</span>
                    </div>
                  </div>
                    <p className="text-sm text-foreground/90 leading-relaxed mt-1 break-words text-left">
                    {d.texto}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação: 10 páginas */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          {Array.from({ length: Math.min(10, paginaTotal) }).map((_, i) => {
            const n = i + 1;
            return (
              <Button
                key={n}
                variant={n === page ? "default" : "secondary"}
                size="sm"
                onClick={() => setPage(n)}
                className="w-8"
              >
                {n}
              </Button>
            );
          })}
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= paginaTotal}
            onClick={() => setPage((p) => Math.min(paginaTotal, p + 1))}
          >
            Próxima
          </Button>
        </div>

        {/* Formulário: aparece apenas localmente para o usuário */}
        <div className="rounded-xl border border-border p-4 bg-card/70 space-y-3">
          <div className="text-sm font-semibold text-center">Deixe sua avaliação</div>
          <div className="grid gap-2">
            <Input
              placeholder="Seu nome (opcional)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Textarea
              placeholder={`O que mais te ajudou no programa de ${tema}?`}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sua nota:</span>
              <StarsPicker value={nota} onChange={setNota} />
            </div>
            <Button onClick={publicar} disabled={!texto.trim()}>
              Publicar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Observação: seu comentário aparece apenas para você nesta sessão.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
