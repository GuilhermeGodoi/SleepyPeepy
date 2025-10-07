import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";
import BreathingTimer478 from "@/components/BreathingTimer478";
import breathingImage from "@/assets/breathing-exercises.jpg";

const Exercicios = () => {
  const [timerSeconds, setTimerSeconds] = useState(240); // 4 minutos
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(-1); // Start with 4-7-8 breathing

  const exercises = [
    {
      title: "Respiração Diafragmática",
      description: "Ativa o sistema nervoso parassimpático, reduzindo ansiedade e preparando o corpo para o sono profundo",
      duration: 300,
      steps: [
        "Deite-se confortavelmente de costas ou sente-se em posição ereta",
        "Coloque uma mão no peito e outra na barriga, logo acima do umbigo",
        "Inspire profundamente pelo nariz por 4 segundos, expandindo apenas a barriga (não o peito)",
        "Segure o ar por 2 segundos",
        "Expire lentamente pela boca por 6 segundos, contraindo suavemente o abdômen",
        "A mão no peito deve permanecer quase imóvel",
        "Repita por 5 minutos, focando no movimento abdominal"
      ],
      benefits: "Reduz frequência cardíaca, baixa pressão arterial e diminui cortisol (hormônio do estresse)"
    },
    {
      title: "Body Scan (Varredura Corporal)",
      description: "Técnica de mindfulness que promove relaxamento progressivo de todo o corpo, liberando tensões acumuladas",
      duration: 600,
      steps: [
        "Deite-se confortavelmente de costas, braços ao lado do corpo, palmas para cima",
        "Feche os olhos e respire naturalmente por alguns momentos",
        "Concentre-se nos dedos dos pés: observe sensações, libere toda tensão",
        "Suba gradualmente: pés → tornozelos → panturrilhas → joelhos → coxas",
        "Continue: quadris → abdômen → peito → costas → ombros",
        "Finalize: braços → mãos → pescoço → rosto → topo da cabeça",
        "Em cada área, passe 20-30 segundos: note tensões e conscientemente relaxe",
        "Se a mente vagar, gentilmente retorne à área do corpo em foco"
      ],
      benefits: "Reduz insônia em 75% após prática regular, melhora consciência corporal e alivia dores crônicas"
    },
    {
      title: "Relaxamento Muscular Progressivo",
      description: "Tensione e relaxe grupos musculares sistematicamente para liberar estresse físico profundo",
      duration: 480,
      steps: [
        "Deite-se ou sente-se confortavelmente",
        "Comece pelos pés: contraia todos os músculos por 5 segundos, depois relaxe por 10 segundos",
        "Sinta a diferença entre tensão e relaxamento",
        "Suba gradualmente: panturrilhas → coxas → glúteos → abdômen → peito",
        "Continue: mãos (feche punhos) → braços → ombros → pescoço",
        "Finalize: rosto (franza testa, aperte olhos, comprima lábios)",
        "Respire profundamente entre cada grupo muscular",
        "Termine com 2 minutos de respiração profunda, sentindo todo o corpo relaxado"
      ],
      benefits: "Estudos mostram 60% de melhora na qualidade do sono e redução significativa de ansiedade"
    }
  ];

  const currentExerciseData = currentExercise >= 0 ? exercises[currentExercise] : exercises[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimerSeconds(currentExerciseData.duration);
  };

  const handleExerciseChange = (index: number) => {
    setCurrentExercise(index);
    setIsRunning(false);
    if (index >= 0) {
      setTimerSeconds(exercises[index].duration);
    }
  };

  const progress = currentExercise >= 0 
    ? ((currentExerciseData.duration - timerSeconds) / currentExerciseData.duration) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header with Image */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative mb-6 sm:mb-8 rounded-lg overflow-hidden shadow-soft">
              <img 
                src={breathingImage} 
                alt="Exercícios de respiração e meditação"
                className="w-full h-48 sm:h-64 object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-lavender bg-clip-text text-transparent">
                  Exercícios de Relaxamento
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-foreground/90 max-w-2xl">
                  Técnicas cientificamente comprovadas para reduzir estresse, ansiedade e preparar seu corpo para um sono profundo
                </p>
              </div>
            </div>
          </div>

          {/* Exercise Selector */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4 text-center">
              Escolha seu Exercício
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {/* Breathing 4-7-8 Button */}
              <button
                onClick={() => setCurrentExercise(-1)}
                className={`p-4 sm:p-5 rounded-lg border transition-all text-left ${
                  currentExercise === -1
                    ? "border-accent bg-accent/20 shadow-glow"
                    : "border-accent bg-accent/10 hover:bg-accent/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1">Respiração 4-7-8 (Guiada)</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Técnica automática com avisos sonoros • 4 ciclos</p>
                  </div>
                  <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-accent flex-shrink-0 ml-2" />
                </div>
              </button>

              {/* Other Exercises */}
              {exercises.map((exercise, index) => (
                <button
                  key={index}
                  onClick={() => handleExerciseChange(index)}
                  className={`p-4 sm:p-5 rounded-lg border transition-all text-left ${
                    currentExercise === index
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1">{exercise.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-primary ml-3 flex-shrink-0">
                      {formatTime(exercise.duration)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Display Area */}
          {currentExercise === -1 ? (
            // Breathing 4-7-8 Component
            <div className="mb-6 sm:mb-8">
              <BreathingTimer478 />
            </div>
          ) : (
            // Timer Card for selected exercise
            <Card className="bg-gradient-calm border-border shadow-soft mb-6 sm:mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-foreground">{currentExerciseData.title}</CardTitle>
                </div>
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {currentExerciseData.description}
                </CardDescription>
                {currentExerciseData.benefits && (
                  <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-xs sm:text-sm text-foreground">
                      <strong>Benefícios:</strong> {currentExerciseData.benefits}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {/* Timer Display */}
                <div className="text-center mb-6">
                  <div className="relative inline-block w-40 h-40 sm:w-48 sm:h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        stroke="hsl(var(--secondary))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                        className="transition-all duration-1000"
                        style={{
                          strokeLinecap: 'round'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tabular-nums">
                        {formatTime(timerSeconds)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6">
                  <Button
                    size="lg"
                    onClick={() => setIsRunning(!isRunning)}
                    className="shadow-glow w-full sm:w-auto"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleReset}
                    className="w-full sm:w-auto"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reiniciar
                  </Button>
                </div>

                {/* Steps */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-semibold text-base sm:text-lg text-foreground mb-3">Passo a passo:</h4>
                  {currentExerciseData.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm sm:text-base font-semibold text-primary">
                        {index + 1}
                      </div>
                      <p className="text-sm sm:text-base text-foreground leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center space-y-3 bg-card/50 rounded-lg p-4 sm:p-6 border border-border">
            <p className="text-sm sm:text-base text-foreground font-semibold">
              💡 Dicas para Melhor Resultado
            </p>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-2 text-left max-w-2xl mx-auto">
              <li>✓ Pratique estes exercícios 30-60 minutos antes de dormir</li>
              <li>✓ Escolha um ambiente calmo, com pouca luz e sem distrações</li>
              <li>✓ Use roupas confortáveis e solte o corpo</li>
              <li>✓ A prática regular (diária) traz resultados muito melhores</li>
              <li>✓ Não se preocupe se a mente divagar - é normal! Gentilmente retorne ao exercício</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Exercicios;
