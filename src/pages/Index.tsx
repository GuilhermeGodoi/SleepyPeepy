import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AlertCircle, Heart, Brain, Battery, Zap, CheckCircle, Moon, Sun, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-sleep-room.jpg";
import meditationImage from "@/assets/meditation-peace.jpg";
import morningImage from "@/assets/morning-energy.jpg";

const Index = () => {
  const problems = [
    {
      icon: AlertCircle,
      title: "Ansiedade Constante",
      description: "Preocupação excessiva que paralisa e impede você de viver plenamente o dia."
    },
    {
      icon: Moon,
      title: "Insônia e Noites Mal Dormidas",
      description: "Dificuldade para adormecer ou manter o sono, acordando cansado."
    },
    {
      icon: Brain,
      title: "Pensamentos Acelerados",
      description: "Mente que não desliga, especialmente à noite na hora de dormir."
    },
    {
      icon: Battery,
      title: "Fadiga e Exaustão",
      description: "Cansaço durante o dia causado por ansiedade e sono inadequado."
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Tranquilidade Diária",
      description: "Controle ansiedade, reduza preocupações e viva com mais leveza."
    },
    {
      icon: Moon,
      title: "Noites Restauradoras",
      description: "Adormeça rápido, durma profundamente e acorde revigorado."
    },
    {
      icon: Brain,
      title: "Clareza Mental",
      description: "Mente descansada significa melhor foco, memória e produtividade."
    },
    {
      icon: Zap,
      title: "Energia e Vitalidade",
      description: "Menos ansiedade + sono de qualidade = disposição para viver plenamente."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Quarto sereno com iluminação ambiente relaxante"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-night opacity-80"></div>
        </div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Vença a <span className="text-purple-400 drop-shadow-glow">Ansiedade</span> e <br className="hidden sm:block" />
            Durma com Qualidade Todas as Noites
          </h1>
          <p className="text-lg sm:text-xl text-foreground/90 mb-6 sm:mb-8 px-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150 leading-relaxed">
            <span className="text-purple-300 font-semibold">Ansiedade</span> e <span className="text-blue-300 font-semibold">insônia</span> andam juntas. Quebre esse ciclo com nossos programas completos de <span className="text-white font-bold">7 dias</span>. 
            Técnicas cientificamente comprovadas para acalmar sua mente durante o dia e garantir noites restauradoras.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Link to="/projeto-7-dias/ansiedade" className="w-full sm:w-auto">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none hover:scale-105 w-full sm:w-auto">
                🧘 Vencer Ansiedade em 7 Dias
              </Button>
            </Link>
            <Link to="/projeto-7-dias" className="w-full sm:w-auto">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none hover:scale-105 w-full sm:w-auto">
                😴 Dormir Melhor em 7 Dias
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Moon className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">7 Dias</div>
              <p className="text-sm sm:text-base text-muted-foreground">Programa completo estruturado</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">15 Min</div>
              <p className="text-sm sm:text-base text-muted-foreground">Exercícios diários guiados</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Sun className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">100%</div>
              <p className="text-sm sm:text-base text-muted-foreground">Técnicas naturais e saudáveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              O Ciclo Vicioso: Ansiedade e Insônia
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4 max-w-2xl mx-auto">
              86 milhões de brasileiros sofrem com ansiedade e 73 milhões têm problemas de sono. 
              Ansiedade causa insônia, e a falta de sono piora a ansiedade. Veja os impactos:
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-card border-border hover:shadow-soft transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 delay-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10 flex-shrink-0">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
                      </div>
                      <CardTitle className="text-foreground text-base sm:text-lg">{problem.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{problem.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-8 sm:mt-12 bg-card/50 rounded-lg p-6 sm:p-8 border border-border">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src={meditationImage} 
                alt="Pessoa meditando em paz"
                className="w-full md:w-1/3 rounded-lg object-cover h-48 md:h-auto"
              />
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Quebre o Ciclo: A Solução Integrada
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Criamos dois programas complementares de 7 dias: um focado em técnicas anti-ansiedade 
                  (respiração, mindfulness, reestruturação cognitiva) e outro em higiene do sono 
                  (rotinas noturnas, ambiente ideal, nutrição). Juntos ou separados, eles trabalham 
                  para acalmar sua mente durante o dia e garantir noites restauradoras.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">100% natural.</strong> Sem medicamentos, sem truques. 
                  Apenas ciência aplicada e hábitos saudáveis que transformam sua vida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-calm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              Os Benefícios de Mente Calma e Sono Restaurador
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4 max-w-2xl mx-auto">
              Controle sua ansiedade durante o dia e durma profundamente à noite. Veja a transformação completa:
            </p>
          </div>
          
          <div className="mb-8 sm:mb-12 bg-card/30 backdrop-blur rounded-lg p-6 sm:p-8 border border-border/50">
            <div className="flex flex-col md:flex-row-reverse items-center gap-6">
              <img 
                src={morningImage} 
                alt="Acordando com energia e disposição"
                className="w-full md:w-1/3 rounded-lg object-cover h-48 md:h-auto"
              />
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Dias Tranquilos, Noites Profundas
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Imagine viver sem aquele peso constante da ansiedade e acordar verdadeiramente descansado. 
                  Quando você domina sua mente durante o dia e otimiza seu sono à noite, recupera até 80% 
                  mais qualidade de vida e energia.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Ansiedade reduzida em até 60% com técnicas diárias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Adormeça 50% mais rápido e durma 70% melhor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Mais foco, disposição e prazer em viver cada dia</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-card/50 backdrop-blur border-border hover:shadow-glow transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <CardTitle className="text-foreground text-base sm:text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8 sm:mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/projeto-7-dias-ansiedade" className="block sm:inline-block">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none hover:scale-105 w-full sm:w-auto">
                  🧘 Programa de 7 Dias - Ansiedade
                </Button>
              </Link>
              <Link to="/projeto-7-dias" className="block sm:inline-block">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none hover:scale-105 w-full sm:w-auto">
                  😴 Programa de 7 Dias - Sono
                </Button>
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground px-4">
              ✨ Gratuito • Sem necessidade de cadastro • Comece imediatamente
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
