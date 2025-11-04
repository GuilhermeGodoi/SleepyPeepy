import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Check,
    Shield,
    Clock,
    Smartphone,
    Users,
    Brain,
    Leaf,
    Headphones,
    Moon,
    MessageCircle,
    Zap,
    Star,
    TrendingUp,
    Award,
    Heart,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Link, useNavigate } from "react-router-dom"; // <-- ADICIONADO useNavigate
import { Badge } from "@/components/ui/badge";

/* ===== Banner REMOVIDO ===== */
// import banner from "@/assets/Banner_pre_black_friday_resized.png";

/* ===== Util: agora do Brasil e countdown até meia-noite America/Sao_Paulo ===== */
function getBrazilParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).formatToParts(date);
    const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return {
        year: Number(map.year),
        month: Number(map.month),
        day: Number(map.day),
        hour: Number(map.hour),
        minute: Number(map.minute),
        second: Number(map.second),
    };
}
function getBrazilNowUTCDate() {
    const { year, month, day, hour, minute, second } = getBrazilParts();
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}
function getBrazilMidnightUTCDate() {
    const { year, month, day } = getBrazilParts();
    return new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));
}
function formatHMS(ms: number) {
    if (ms < 0) ms = 0;
    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

const Vendas: React.FC = () => {
    const navigate = useNavigate(); // <-- ADICIONADO
    const goToCheckout = (plano: "mensal" | "semestral" | "anual") =>
        navigate(`/checkout?plano=${plano}`);

    const scrollToPlans = () => {
        document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
    };

    // ===== Countdown diário até 00:00 (America/Sao_Paulo) =====
    const [remainingMs, setRemainingMs] = useState(() => {
        const now = getBrazilNowUTCDate().getTime();
        const end = getBrazilMidnightUTCDate().getTime();
        return end - now;
    });
    useEffect(() => {
        const id = setInterval(() => {
            const now = getBrazilNowUTCDate().getTime();
            const end = getBrazilMidnightUTCDate().getTime();
            setRemainingMs(Math.max(0, end - now));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    // ===== COPY FOCO EM ANSIEDADE =====
    const benefits = useMemo(
        () => [
            {
                icon: Brain,
                text: "Reduz a ansiedade com técnicas práticas do dia a dia",
                gradient: "from-purple-500 to-pink-500",
            },
            {
                icon: Activity,
                text: "Alivia sintomas físicos (taquicardia, tensão, agitação)",
                gradient: "from-rose-500 to-orange-500",
            },
            {
                icon: Users,
                text: "Exercícios guiados de respiração e grounding",
                gradient: "from-blue-500 to-cyan-500",
            },
            {
                icon: Headphones,
                text: "Áudios calmantes e protocolos de autocuidado",
                gradient: "from-violet-500 to-purple-500",
            },
            {
                icon: Leaf,
                text: "Rotinas e receitas relaxantes para regular o sistema nervoso",
                gradient: "from-green-500 to-emerald-500",
            },
            {
                icon: MessageCircle,
                text: "Comunidade e suporte para manter a constância",
                gradient: "from-pink-500 to-rose-500",
            },
        ],
        []
    );

    const testimonials = useMemo(
        () => [
            { name: "Juliana M.", age: "29 anos", text: "Minhas crises de ansiedade diminuíram muito. Em poucos dias, senti meu corpo menos tenso.", rating: 5 },
            { name: "Roberto S.", age: "45 anos", text: "Eu vivia no alerta máximo. Hoje consigo desacelerar, respirar e dormir melhor.", rating: 5 },
            { name: "Mariana L.", age: "32 anos", text: "Não é milagre — é método. Os exercícios e áudios salvaram minhas noites.", rating: 5 },
        ],
        []
    );

    // ===== TODOS OS PLANOS ENTREGAM O MESMO PACOTE =====
    const commonPlanBenefits = [
        "Protocolo de 7 dias: Insônia & Ansiedade",
        "Resultados rápidos (minutos por dia)",
        "Timers de respiração/meditação para crises",
        "Áudios para dormir e relaxar",
        "Exercícios guiados + rotina antiestresse",
        "Receitas relaxantes (chás, rituais noturnos)",
        "Descontos em melatonina e afins",
        "Comunidade + suporte",
        "Acesso imediato, 100% online",
        "Cancelamento fácil",
    ];

    const plans = useMemo(
        () => [
            {
                name: "Mensal",
                price: "47",
                period: "/mês",
                originalPrice: "147",
                benefits: commonPlanBenefits,
                popular: false,
            },
            {
                name: "Semestral",
                price: "222",
                pricePerMonth: "37",
                period: "/mês",
                economy: "20% OFF",
                originalPrice: "282",
                benefits: commonPlanBenefits,
                popular: true,
            },
            {
                name: "Anual",
                price: "384",
                pricePerMonth: "32",
                period: "/mês",
                economy: "30% OFF",
                originalPrice: "564",
                benefits: commonPlanBenefits,
                popular: false,
            },
        ],
        []
    );

    const steps = useMemo(
        () => [
            { number: "1", title: "Escolha seu plano", description: "Selecione a melhor opção para você", icon: Star },
            { number: "2", title: "Crie sua conta", description: "Cadastro rápido e seguro", icon: Zap },
            { number: "3", title: "Acesse os módulos", description: "Práticas para ansiedade e rotina", icon: TrendingUp },
            { number: "4", title: "Veja os resultados", description: "Sinta a mente mais calma", icon: Award },
        ],
        []
    );

    const faqs = useMemo(
        () => [
            {
                question: "O SleepyPeepy é para ansiedade?",
                answer:
                    "Sim — aqui você compra a solução completa contra ansiedade. Protocolos práticos, timers de respiração/meditação, exercícios, áudios e rotinas para reduzir sintomas e recuperar o equilíbrio.",
            },
            { question: "Posso cancelar quando quiser?", answer: "Sim! Você pode cancelar a qualquer momento direto pela sua conta, sem burocracia ou multas." },
            { question: "Preciso instalar app?", answer: "Não. Você acessa pelo navegador do celular, tablet ou computador." },
            { question: "Funciona mesmo se eu tiver muita ansiedade?", answer: "Sim. O método foi construído para quem convive com ansiedade intensa e insônia, com técnicas testadas e fáceis de aplicar no dia a dia." },
            { question: "O pagamento é seguro?", answer: "Totalmente seguro. Utilizamos criptografia de ponta e parceiros confiáveis de pagamento." },
        ],
        []
    );

    const stats = useMemo(
        () => [
            { value: "4.9/5", label: "Avaliação média" },
            { value: "7 dias", label: "Para sentir efeito inicial" },
            { value: "98%", label: "Relatam mais calma diária" },
            { value: "+5.000", label: "Pessoas impactadas" },
        ],
        []
    );

    // ===== Scroll horizontal mobile: snap + auto-centralizar =====
    const railRef = useRef<HTMLDivElement | null>(null);
    theScroll: {
    }
    const scrollTimeoutRef = useRef<number | null>(null);

    function centerNearestCard() {
        const rail = railRef.current;
        if (!rail) return;
        const children = Array.from(rail.children) as HTMLElement[];
        if (!children.length) return;

        const railRect = rail.getBoundingClientRect();
        const railCenter = railRect.left + railRect.width / 2;

        let best: { node: HTMLElement; dist: number } | null = null;
        children.forEach((child) => {
            const rect = child.getBoundingClientRect();
            const childCenter = rect.left + rect.width / 2;
            const dist = Math.abs(childCenter - railCenter);
            if (!best || dist < best.dist) best = { node: child as HTMLElement, dist };
        });

        if (best?.node) {
            const child = best.node;
            const childCenter = child.offsetLeft + child.offsetWidth / 2;
            const target = childCenter - rail.clientWidth / 2;
            rail.scrollTo({ left: target, behavior: "smooth" });
        }
    }
    function onUserScroll() {
        if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = window.setTimeout(() => {
            centerNearestCard();
        }, 120);
    }
    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;
        const popularIndex = plans.findIndex((p) => p.popular);
        const idx = popularIndex >= 0 ? popularIndex : 0;
        const child = rail.children[idx] as HTMLElement | undefined;
        if (child) {
            const childCenter = child.offsetLeft + child.offsetWidth / 2;
            const target = childCenter - rail.clientWidth / 2;
            rail.scrollTo({ left: target, behavior: "smooth" });
        }
    }, [plans]);

    return (
        <div className="min-h-screen bg-gradient-night">
            {/* Header fixo */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-xl border-b border-border/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="p-2 rounded-lg bg-gradient-lavender">
                                <Moon className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
                            </div>
                            <span className="text-lg md:text-xl font-bold bg-gradient-lavender bg-clip-text text-transparent">
                                SleepyPeepy
                            </span>
                        </div>

                        {/* sem acesso à vendas pelo menu */}
                        <nav className="hidden lg:flex items-center gap-6">
                            <a href="#inicio" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Início</a>
                            <a href="#beneficios" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Benefícios</a>
                            <a href="#planos" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Planos</a>
                            <a href="#faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">FAQ</a>
                            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Entrar</Link>
                        </nav>

                        <Button onClick={scrollToPlans} size="sm" className="bg-gradient-lavender hover:opacity-90 shadow-glow text-xs md:text-sm px-3 md:px-4">
                            Ver planos
                        </Button>
                    </div>
                </div>
            </header>

{/* ===== TIMER FIXO ABAIXO DO MENU ===== */}
<div className="fixed top-16 left-0 right-0 z-40 bg-[#ff1a1a] text-white text-center font-extrabold py-3 shadow-[0_0_20px_rgba(255,0,0,0.5)] border-b border-red-700 animate-pulse">
  ⏰ <span className="text-lg md:text-2xl tracking-wider">OFERTA TERMINA EM</span>
  <span className="ml-2 text-2xl md:text-4xl font-mono bg-black/20 px-3 py-1 rounded-md">
    {formatHMS(remainingMs)}
  </span>
</div>




            {/* HERO */}
            <section id="inicio" className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="text-center mb-6 md:mb-8">
                        <Badge className="mb-4 md:mb-6 bg-primary/20 text-primary border-primary/30 px-3 md:px-4 py-1 text-xs md:text-sm">
                            <Zap className="h-3 w-3 mr-1" />
                            Programa Anti-Ansiedade
                        </Badge>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 bg-gradient-lavender bg-clip-text text-transparent leading-tight px-2">
                            Controle a ansiedade. Durma melhor. Viva leve.
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
                            Método guiado para reduzir sintomas, acalmar o corpo e recuperar o sono — resultados já nos
                            <span className="font-bold text-transparent bg-gradient-lavender bg-clip-text"> primeiros 7 dias</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
                            <Button onClick={scrollToPlans} size="lg" className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-gradient-lavender hover:opacity-90 shadow-glow">
                                <Zap className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                                Começar agora — R$47/mês
                            </Button>
                            <Button onClick={scrollToPlans} size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-primary/30 hover:bg-primary/10">
                                Ver Planos
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 md:p-4">
                                    <div className="text-xl md:text-3xl font-bold bg-gradient-lavender bg-clip-text text-transparent">{stat.value}</div>
                                    <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 px-2">
                            <div className="flex items-center gap-2 text-foreground/80">
                                <div className="p-1.5 md:p-2 rounded-lg bg-primary/20">
                                    <Smartphone className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                                </div>
                                <span className="text-xs md:text-sm font-medium">100% online</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/80">
                                <div className="p-1.5 md:p-2 rounded-lg bg-primary/20">
                                    <Shield className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                                </div>
                                <span className="text-xs md:text-sm font-medium">Cancelamento fácil</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/80">
                                <div className="p-1.5 md:p-2 rounded-lg bg-primary/20">
                                    <Clock className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                                </div>
                                <span className="text-xs md:text-sm font-medium">Acesso imediato</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* MOTIVOS DA ANSIEDADE — versão otimizada */}
<section
  id="motivos"
  className="py-10 md:py-14 px-4 bg-card/30 backdrop-blur-sm relative overflow-hidden"
>
  {/* Fundo sutil lavanda */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-1/3 left-0 w-56 h-56 bg-primary/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/3 right-0 w-56 h-56 bg-accent/10 rounded-full blur-3xl"></div>
  </div>

  <div className="container mx-auto max-w-5xl relative z-10 text-center">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-gradient-lavender bg-clip-text text-transparent">
      Motivos que alimentam sua ansiedade
    </h2>
    <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-8">
      Situações comuns que desgastam sua mente e seu corpo — veja se você se identifica.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-left">
      {[
        { Icon: TrendingUp, text: "Pressão no trabalho e chefe exigente." },
        { Icon: Zap, text: "Dinheiro curto e contas acumulando." },
        { Icon: Heart, text: "Relacionamentos cheios de conflito." },
        { Icon: Smartphone, text: "Excesso de redes sociais e comparações." },
        { Icon: MessageCircle, text: "Ambiente tóxico em casa ou no trabalho." },
        { Icon: Moon, text: "Noites ruins e mente acelerada." },
        { Icon: Users, text: "Sensação de solidão mesmo acompanhado." },
        { Icon: Activity, text: "Sedentarismo e falta de energia." },
        { Icon: Brain, text: "Autocobrança por ser sempre “perfeito”." },
        { Icon: Clock, text: "Medo do futuro e da incerteza." },
      ].map(({ Icon, text }, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl bg-card/60 border border-border/30 hover:border-primary/40 hover:shadow-glow transition-all duration-300"
        >
          <div className="p-2 rounded-lg bg-gradient-lavender shrink-0">
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <p className="text-sm md:text-base text-foreground/90 leading-snug">
            {text}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-8">
      <Button
        onClick={scrollToPlans}
        size="sm"
        className="text-sm md:text-base px-6 py-4 bg-gradient-lavender hover:opacity-90 shadow-glow font-semibold tracking-wide"
      >
        Quero resolver isso agora
      </Button>
    </div>
  </div>
</section>

            {/* BENEFÍCIOS */}
            <section id="beneficios" className="py-12 md:py-20 px-4 relative">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-lavender bg-clip-text text-transparent px-2">
                            Tudo o que você precisa para vencer a ansiedade
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                            Método prático, protocolos guiados e suporte para recuperar o controle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <Card key={index} className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-glow hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="pt-4 md:pt-6 px-4">
                                        <div className="flex flex-col gap-3 md:gap-4">
                                            <div className={`self-start p-3 md:p-4 rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg`}>
                                                <Icon className="h-5 md:h-6 w-5 md:w-6 text-white" />
                                            </div>
                                            <p className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                                                {benefit.text}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* PROVA SOCIAL */}
            <section className="py-12 md:py-20 px-4 bg-card/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 md:mb-12">
                        <Badge className="mb-3 md:mb-4 bg-primary/20 text-primary border-primary/30 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-base">
                            <Heart className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2 fill-current" />
                            +5.000 pessoas já reduziram a ansiedade
                        </Badge>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-lavender bg-clip-text text-transparent px-2">
                            Histórias reais de transformação
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300">
                                <CardContent className="pt-4 md:pt-6 px-4">
                                    <div className="flex flex-col gap-3 md:gap-4">
                                        <div className="flex gap-0.5 md:gap-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 md:h-5 w-4 md:w-5 fill-primary text-primary" />
                                            ))}
                                        </div>
                                        <p className="text-sm md:text-base text-foreground/90 italic leading-relaxed">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl bg-gradient-lavender shadow-lg shrink-0">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm md:text-base text-foreground">{testimonial.name}</p>
                                                <p className="text-xs md:text-sm text-muted-foreground">{testimonial.age}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* PLANOS */}
            <section
                id="planos"
                className="py-12 md:py-20 px-4 relative overflow-visible scroll-mt-40 md:scroll-mt-56 mt-8 md:mt-12"
            >
                {/* Glow decorativo */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 overflow-visible">
                    <div className="text-center mb-4 md:mb-6">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-lavender bg-clip-text text-transparent px-2">
                            Escolha seu plano antiansiedade
                        </h2>

                        {/* Oferta + Timer */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-red-500/15 text-red-400 border-red-500/30 px-3 py-1 text-xs md:text-sm">
                                    Oferta por tempo limitado
                                </Badge>
                                <span className="text-xs md:text-sm text-muted-foreground">
                                    De <span className="line-through">R$147</span> por{" "}
                                    <span className="font-semibold text-foreground">R$47/mês</span>
                                </span>
                            </div>
                            <span className="text-xs md:text-sm text-muted-foreground">
                                Termina em{" "}
                                <span className="font-semibold text-foreground">
                                    {formatHMS(remainingMs)}
                                </span>
                            </span>
                        </div>

                        <p className="text-base md:text-lg text-muted-foreground mt-3 px-4">
                            Inclui planos de 7 dias (Insônia e Ansiedade), receitas, timers de
                            respiração/meditação, exercícios guiados e descontos em produtos e
                            muito mais.
                            <br />
                            <br />
                        </p>
                    </div>

                    {/* Rail mobile (sem clipping) */}
                    <div
                        ref={railRef}
                        onScroll={onUserScroll}
                        className="
                relative
                flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                px-2 pb-2 pt-10 md:pt-12     /* <-- headroom para o chip fora do card */
                sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0
                scroll-smooth hide-scroll
            "
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>

                        {plans.map((plan, index) => {
                            const isSemestral = plan.name.toLowerCase() === "semestral";
                            // slug do plano para o checkout:
                            const slug =
                                plan.name.toLowerCase() === "mensal"
                                    ? "mensal"
                                    : isSemestral
                                        ? "semestral"
                                        : "anual";

                            return (
                                // WRAPPER com espaço no topo e posição relativa — o chip fica FORA do card
                                <div
                                    key={index}
                                    className="
                    relative min-w-[85%] snap-center sm:min-w-0
                    pt-7 md:pt-9   /* reserva espaço para o chip fora do card */
                  "
                                    style={{ scrollSnapAlign: "center" }}
                                >
                                    {isSemestral && (
                                        <div className="
    absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
    px-4 md:px-6 py-1.5 md:py-2 rounded-full
    bg-gradient-lavender text-white text-xs md:text-sm font-bold shadow-glow whitespace-nowrap
  ">
                                            ⭐ Mais Popular
                                        </div>
                                    )}

                                    <Card
                                        className={`relative border-2 transition-all duration-300
                      ${plan.popular
                                                ? "border-primary shadow-glow sm:scale-105 bg-gradient-to-b from-card to-card/50"
                                                : "border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-soft"
                                            }
                    `}
                                        style={{ overflow: "visible" }}
                                    >
                                        {/* Badge de desconto continua DENTRO do card (canto superior direito) */}
                                        {"economy" in plan && (plan as any).economy && (
                                            <div className="absolute top-2 right-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs md:text-sm font-bold shadow-lg">
                                                {(plan as any).economy as string}
                                            </div>
                                        )}

                                        <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
                                            <CardTitle className="text-xl md:text-2xl font-bold">
                                                {plan.name}
                                            </CardTitle>
                                            <CardDescription>
                                                <div className="mt-4 md:mt-6">
                                                    {plan.originalPrice && (
                                                        <div className="text-xs md:text-sm text-muted-foreground line-through mb-1">
                                                            De R${plan.originalPrice}
                                                        </div>
                                                    )}
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xs md:text-sm text-muted-foreground">
                                                            R$
                                                        </span>
                                                        <span className="text-4xl md:text-5xl font-bold text-foreground">
                                                            {"pricePerMonth" in plan &&
                                                                (plan as any).pricePerMonth
                                                                ? (plan as any).pricePerMonth
                                                                : plan.price}
                                                        </span>
                                                        <span className="text-sm md:text-base text-muted-foreground">
                                                            {plan.period}
                                                        </span>
                                                    </div>
                                                    {"pricePerMonth" in plan &&
                                                        (plan as any).pricePerMonth && (
                                                            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
                                                                Total: <span className="font-semibold">R${plan.price}</span> no plano{" "}
                                                                {plan.name.toLowerCase()}
                                                            </p>
                                                        )}
                                                </div>
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="pb-4 md:pb-6 px-4 md:px-6">
                                            <ul className="space-y-2 md:space-y-3">
                                                {plan.benefits.map((benefit: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <div className="mt-0.5 p-0.5 md:p-1 rounded-full bg-primary/20 shrink-0">
                                                            <Check className="h-3 md:h-4 w-3 md:w-4 text-primary" />
                                                        </div>
                                                        <span className="text-xs md:text-sm text-foreground/90 leading-tight">
                                                            {benefit}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>

                                        <CardFooter className="px-4 md:px-6 pb-4 md:pb-6">
                                            <Button
                                                className={`w-full text-sm md:text-base ${plan.popular ? "bg-gradient-lavender shadow-glow" : ""
                                                    }`}
                                                variant={plan.popular ? "default" : "outline"}
                                                size="lg"
                                                onClick={() => {
                                                    // ===== Meta Pixel: evento de início de checkout =====
                                                    if (typeof window !== "undefined" && typeof window.fbq === "function") {
                                                        window.fbq("track", "InitiateCheckout", {
                                                            content_category: "planos",
                                                            content_name: `Plano ${slug}`,
                                                            value: plan.price,
                                                            currency: "BRL",
                                                        });
                                                    }

                                                    // Redireciona para o checkout normalmente
                                                    goToCheckout(slug);
                                                }}
                                            >
                                                <Zap className="mr-2 h-3 md:h-4 w-3 md:w-4" />
                                                Assinar Agora
                                            </Button>
                                        </CardFooter>

                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* COMO FUNCIONA */}
            <section className="py-12 md:py-20 px-4 bg-card/30">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16 bg-gradient-lavender bg-clip-text text-transparent px-2">
                        Como funciona para ansiedade
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative">
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                                    )}
                                    <div className="relative text-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center bg-gradient-lavender shadow-glow">
                                            <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                                        </div>
                                        <div className="absolute -top-1 md:-top-2 -right-1 md:-right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs md:text-sm border-2 border-primary">
                                            {step.number}
                                        </div>
                                        <h3 className="font-semibold mb-1 md:mb-2 text-foreground text-sm md:text-base">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* GARANTIA */}
            <section className="py-12 md:py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-glow">
                        <CardContent className="pt-8 md:pt-12 pb-8 md:pb-12 px-4 md:px-6 text-center">
                            <div className="inline-block p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-lavender mb-4 md:mb-6 shadow-glow">
                                <Shield className="h-10 w-10 md:h-12 md:w-12 text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-lavender bg-clip-text text-transparent">
                                🔒 Compra 100% Segura
                            </h2>
                            <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                Você pode cancelar a qualquer momento direto pela sua conta. Sem letras miúdas, sem burocracia.
                                Seu investimento é protegido e seu bem-estar é nossa prioridade.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-12 md:py-20 px-4 bg-card/30">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 bg-gradient-lavender bg-clip-text text-transparent px-2">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-center text-sm md:text-base text-muted-foreground mb-8 md:mb-12 px-4">
                        Tire suas dúvidas antes de começar sua transformação
                    </p>

                    <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-border/50 bg-card/50 backdrop-blur-sm rounded-lg px-4 md:px-6">
                                <AccordionTrigger className="text-left hover:text-primary hover:no-underline text-sm md:text-base py-4">
                                    <span className="font-semibold pr-2">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm md:text-base">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-lavender opacity-10"></div>
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h2 className="text-4xl md:5xl font-bold mb-6 bg-gradient-lavender bg-clip-text text-transparent">
                        Pronto para reduzir a ansiedade? 🌙
                    </h2>
                    <p className="text-xl text-foreground/80 mb-8">
                        Junte-se a quem já está mais calmo, dormindo melhor e vivendo com mais leveza.
                    </p>
                    <Button onClick={scrollToPlans} size="lg" className="text-lg px-12 py-7 bg-gradient-lavender hover:opacity-90 shadow-glow">
                        <Zap className="mr-2 h-5 w-5" />
                        Ver Planos
                    </Button>
                </div>
            </section>

            {/* Footer local da página */}
            <footer className="py-12 px-4 bg-card/50 border-t border-border/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-lavender">
                                <Moon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold bg-gradient-lavender bg-clip-text text-transparent text-lg">
                                    SleepyPeepy
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Solução prática contra a ansiedade.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link>
                            <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link>
                            <a href="mailto:contato@sleepypeepy.com" className="text-muted-foreground hover:text-primary transition-colors">Contato</a>
                        </div>
                    </div>

                    <div className="text-center mt-8 pt-8 border-t border-border/30 text-sm text-muted-foreground">
                        Copyright © SleepyPeepy 2025. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Vendas;
