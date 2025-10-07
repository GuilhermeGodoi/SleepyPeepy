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
      icon: Brain,
      title: "Dificuldade de Concentração",
      description: "A falta de sono prejudica a memória e o raciocínio lógico."
    },
    {
      icon: Heart,
      title: "Problemas Cardiovasculares",
      description: "Aumenta o risco de hipertensão e doenças cardíacas."
    },
    {
      icon: Battery,
      title: "Fadiga Crônica",
      description: "Cansaço constante afeta produtividade e bem-estar."
    },
    {
      icon: AlertCircle,
      title: "Ansiedade e Depressão",
      description: "A privação de sono intensifica problemas emocionais."
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Mais Energia",
      description: "Acorde revigorado e pronto para enfrentar o dia."
    },
    {
      icon: Brain,
      title: "Melhor Memória",
      description: "Consolide aprendizados e melhore o desempenho cognitivo."
    },
    {
      icon: Heart,
      title: "Saúde do Coração",
      description: "Reduza riscos cardiovasculares com sono de qualidade."
    },
    {
      icon: CheckCircle,
      title: "Humor Equilibrado",
      description: "Regule emoções e reduza estresse e ansiedade."
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-lavender bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Transforme Suas Noites, <br className="hidden sm:block" />Renove Seus Dias
          </h1>
          <p className="text-lg sm:text-xl text-foreground/90 mb-6 sm:mb-8 px-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150 leading-relaxed">
            Descubra o poder de uma boa noite de sono com nosso programa completo de 7 dias. 
            Técnicas comprovadas cientificamente para acabar com a insônia e recuperar sua qualidade de vida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Link to="/projeto-7-dias" className="w-full sm:w-auto">
              <Button size="lg" className="shadow-glow w-full sm:w-auto">
                Começar Programa de 7 Dias
              </Button>
            </Link>
            <Link to="/exercicios" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Exercícios de Relaxamento
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
              Os Impactos da Insônia
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4 max-w-2xl mx-auto">
              Mais de 73 milhões de brasileiros sofrem com problemas de sono. 
              Veja como a falta de sono de qualidade afeta sua vida:
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
                  A Solução Está Ao Seu Alcance
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Nosso programa de 7 dias combina técnicas comprovadas de higiene do sono, 
                  exercícios de respiração, mindfulness e ajustes no estilo de vida. 
                  Você aprenderá a preparar seu corpo e mente para noites tranquilas e restauradoras.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Sem medicamentos.</strong> Sem truques. 
                  Apenas ciência aplicada e hábitos saudáveis que você pode manter para sempre.
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
              Transforme Sua Vida com Sono de Qualidade
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4 max-w-2xl mx-auto">
              Veja as mudanças reais que você experimentará ao melhorar seu sono
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
                  Acorde Revigorado Todos os Dias
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Imagine acordar naturalmente, sem alarme, sentindo-se completamente descansado. 
                  Com sono de qualidade, você recupera até 40% mais energia mental e física.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Maior disposição desde o primeiro minuto do dia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Humor estável e positivo ao longo de todo o dia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Sistema imunológico 3x mais forte</span>
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
            <Link to="/projeto-7-dias" className="block sm:inline-block">
              <Button size="lg" variant="secondary" className="shadow-soft w-full sm:w-auto">
                Comece Seu Projeto de 7 Dias Agora
              </Button>
            </Link>
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
