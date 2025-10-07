import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";

const BreathingTimer478 = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest");
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const phases = {
    inhale: { duration: 4, label: "Inspire pelo nariz", color: "hsl(264 65% 60%)" },
    hold: { duration: 7, label: "Segure a respiração", color: "hsl(280 55% 65%)" },
    exhale: { duration: 8, label: "Expire pela boca", color: "hsl(264 50% 50%)" },
    rest: { duration: 0, label: "Pronto para começar", color: "hsl(240 15% 22%)" }
  };

  // Cria um beep sonoro
  const playBeep = (frequency: number = 800, duration: number = 150) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && phase !== "rest") {
      interval = setInterval(() => {
        setPhaseTimer((prev) => {
          const newTime = prev + 0.1;
          const currentPhase = phases[phase];
          
          if (newTime >= currentPhase.duration) {
            // Transição de fase
            if (phase === "inhale") {
              playBeep(600, 200);
              setPhase("hold");
              return 0;
            } else if (phase === "hold") {
              playBeep(500, 200);
              setPhase("exhale");
              return 0;
            } else if (phase === "exhale") {
              const newCycle = cycleCount + 1;
              setCycleCount(newCycle);
              
              if (newCycle >= 4) {
                // Completou 4 ciclos
                playBeep(700, 500);
                setIsRunning(false);
                setPhase("rest");
                setCycleCount(0);
                return 0;
              } else {
                // Próximo ciclo
                playBeep(800, 200);
                setPhase("inhale");
                return 0;
              }
            }
          }
          
          return newTime;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, phase, cycleCount]);

  const handleStart = () => {
    if (!isRunning && phase === "rest") {
      playBeep(800, 200);
      setPhase("inhale");
      setPhaseTimer(0);
      setCycleCount(0);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase("rest");
    setPhaseTimer(0);
    setCycleCount(0);
  };

  const currentPhase = phases[phase];
  const progress = phase !== "rest" ? (phaseTimer / currentPhase.duration) * 100 : 0;
  const timeRemaining = phase !== "rest" ? Math.ceil(currentPhase.duration - phaseTimer) : 0;

  return (
    <Card className="bg-gradient-calm border-border shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-foreground">Respiração 4-7-8</CardTitle>
        </div>
        <CardDescription className="text-sm sm:text-base leading-relaxed">
          Técnica científica do Dr. Andrew Weil - guiada com avisos sonoros • 4 ciclos automáticos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timer Display - Fixed for mobile */}
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
                stroke={currentPhase.color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                className="transition-all duration-100"
                style={{
                  strokeLinecap: 'round'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tabular-nums">
                {timeRemaining > 0 ? timeRemaining : "—"}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground mt-1">segundos</span>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="text-center mb-6 p-3 sm:p-4 bg-secondary/50 rounded-lg">
          <p className="text-base sm:text-lg font-semibold text-foreground mb-1">
            {currentPhase.label}
          </p>
          {phase !== "rest" && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ciclo {cycleCount + 1} de 4
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6">
          <Button
            size="lg"
            onClick={handleStart}
            className="shadow-glow w-full sm:w-auto"
            disabled={isRunning && phase !== "rest"}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Em execução...
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

        {/* Instructions */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="font-semibold text-base sm:text-lg text-foreground">Como funciona:</h4>
          <div className="space-y-2 sm:space-y-3">
            {[
              "🔵 Um bip sonoro marca o início de cada fase",
              "🫁 Inspire profundamente pelo nariz por 4 segundos",
              "⏸️ Segure a respiração por 7 segundos",
              "💨 Expire completamente pela boca por 8 segundos",
              "🔄 Repete automaticamente por 4 ciclos completos"
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded bg-secondary/30">
                <span className="text-sm sm:text-base text-foreground leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs sm:text-sm text-foreground">
              <strong>Benefício:</strong> Esta técnica ativa o sistema nervoso parassimpático, 
              reduzindo ansiedade em minutos e preparando o corpo para sono profundo.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingTimer478;
