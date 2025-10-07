import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Calendar, Info } from "lucide-react";
import sleepRoutineImage from "@/assets/sleep-routine.jpg";
import healthyLifestyleImage from "@/assets/healthy-lifestyle.jpg";

const Projeto7Dias = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean[]>>({});

  const dailyProgram = [
    {
      day: 1,
      title: "Estabelecendo a Base",
      description: "A consistência é o alicerce do bom sono. Hoje, você criará a estrutura fundamental para todas as próximas noites.",
      tasks: [
        "Defina um horário fixo para dormir e acordar (mesmo nos fins de semana)",
        "Evite cafeína após às 14h (café, chás, refrigerantes e chocolate)",
        "Desligue todas as telas 1 hora antes de dormir",
        "Tome um banho morno 30-60 minutos antes de deitar",
        "Prepare seu quarto: escuro, silencioso e temperatura entre 18-22°C",
        "Anote a hora que dormiu e acordou para acompanhar seu progresso"
      ],
      tip: "💡 Use um despertador real em vez do celular para não ter a tentação de mexer no telefone na cama."
    },
    {
      day: 2,
      title: "Construindo uma Rotina Noturna",
      description: "Criar um ritual noturno sinaliza ao cérebro que é hora de desacelerar. Rituais reduzem a ansiedade noturna em até 60%.",
      tasks: [
        "Mantenha rigorosamente os horários estabelecidos no dia 1",
        "Pratique 10 minutos de respiração profunda (use nossa página de exercícios)",
        "Leia um livro físico por 20-30 minutos (evite conteúdo estimulante)",
        "Evite refeições pesadas 3h antes de dormir",
        "Prepare sua roupa e bolsa para o próximo dia (reduz ansiedade)",
        "Anote 3 coisas positivas do seu dia em um diário de gratidão"
      ],
      tip: "💡 Mantenha uma garrafa d'água ao lado da cama, mas evite beber muito líquido 2h antes de dormir."
    },
    {
      day: 3,
      title: "Movimento e Energia",
      description: "Exercícios regulares melhoram a qualidade do sono em 65%. O momento certo faz toda a diferença.",
      tasks: [
        "Faça 30 minutos de exercício aeróbico pela manhã ou tarde",
        "Caminhe ao ar livre para pegar luz natural (regula o ritmo circadiano)",
        "Evite exercícios intensos após às 19h",
        "Pratique 15 minutos de alongamento suave antes de dormir",
        "Mantenha toda a rotina noturna dos dias anteriores",
        "Tome um chá relaxante (camomila, valeriana ou maracujá)",
        "Se exercitou à noite, espere 2-3h antes de dormir"
      ],
      tip: "💡 Exercícios matinais são ideais: aumentam a energia diurna e melhoram o sono noturno."
    },
    {
      day: 4,
      title: "Mente Calma, Corpo Relaxado",
      description: "A meditação e mindfulness reduzem o tempo para adormecer em 50% e melhoram a qualidade do sono profundo.",
      tasks: [
        "Medite por 15 minutos durante o dia (use apps como Insight Timer)",
        "Pratique yoga suave, tai chi ou body scan antes de dormir",
        "Evite discussões e decisões importantes à noite",
        "Faça uma lista das preocupações e deixe-a fora do quarto",
        "Ouça música instrumental calma (60-80 BPM) enquanto se prepara para dormir",
        "Use aromaterapia com lavanda (travesseiro, difusor ou óleo essencial)",
        "Pratique a técnica 4-7-8 na cama (veja nossa página de exercícios)"
      ],
      tip: "💡 Se pensamentos ansiosos aparecerem, anote-os em um papel e retome pela manhã. Libere sua mente."
    },
    {
      day: 5,
      title: "Nutrição para o Sono",
      description: "O que você come afeta diretamente seu sono. Certos nutrientes promovem a produção de melatonina e serotonina.",
      tasks: [
        "Reduza líquidos 2h antes de dormir (evita despertar noturno)",
        "Inclua alimentos ricos em triptofano no jantar (banana, aveia, nozes, peru)",
        "Evite álcool à noite (fragmenta o sono e reduz sono REM)",
        "Evite alimentos picantes, gordurosos ou muito açucarados à noite",
        "Se sentir fome antes de dormir, faça lanche leve (banana com mel, leite morno)",
        "Considere suplementos naturais: magnésio, melatonina (consulte um médico)",
        "Mantenha todas as práticas dos 4 dias anteriores"
      ],
      tip: "💡 Uma xícara de leite dourado (leite com cúrcuma e mel) 1h antes de dormir pode melhorar muito o sono."
    },
    {
      day: 6,
      title: "Santuário do Sono",
      description: "Seu ambiente de sono pode melhorar a qualidade do sono em até 50%. Transforme seu quarto em um santuário.",
      tasks: [
        "Ajuste a temperatura do quarto para 18-22°C (ideal para sono profundo)",
        "Use cortinas blackout ou máscara de dormir (bloqueie 100% da luz)",
        "Experimente ruído branco, ventilador ou sons da natureza (mascara ruídos)",
        "Avalie seu colchão e travesseiro (devem dar suporte adequado)",
        "Remova todos os eletrônicos do quarto (TV, celular, tablets)",
        "Use roupa de cama confortável e respire",
        "Considere usar meias para dormir (melhora a circulação)",
        "Mantenha o quarto limpo e organizado (reduz estresse visual)"
      ],
      tip: "💡 Seu quarto deve ser usado APENAS para dormir e intimidade. Treine seu cérebro a associar o quarto ao sono."
    },
    {
      day: 7,
      title: "Reflexão e Continuidade",
      description: "Parabéns por completar os 7 dias! Agora é hora de consolidar seus aprendizados e planejar o futuro.",
      tasks: [
        "Revise seu diário de sono da semana (horários, qualidade, despertar)",
        "Identifique as 3-5 práticas que mais funcionaram para você",
        "Crie um plano de manutenção com as técnicas mais efetivas",
        "Defina metas de sono para o próximo mês",
        "Celebre seu progresso e reconheça as mudanças positivas",
        "Compartilhe sua experiência com amigos ou familiares",
        "Continue usando pelo menos 3 técnicas diariamente",
        "Agende uma revisão em 30 dias para avaliar progresso contínuo"
      ],
      tip: "💡 Hábitos levam 21-66 dias para se consolidarem. Continue praticando! Você está no caminho certo."
    }
  ];

  const program = dailyProgram[currentDay - 1];

  const toggleTask = (taskIndex: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [taskIndex]: !prev[currentDay]?.[taskIndex]
      }
    }));
  };

  const completedTasks = Object.values(checkedItems[currentDay] || {}).filter(Boolean).length;
  const totalTasks = program.tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-lavender bg-clip-text text-transparent">
              Programa de 7 Dias
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Um guia completo e estruturado para transformar seu sono. 
              Siga cada dia e marque suas conquistas!
            </p>
          </div>

          {/* Info Card */}
          <Card className="mb-6 sm:mb-8 bg-primary/10 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <Info className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="text-foreground font-semibold">
                    Como aproveitar ao máximo este programa:
                  </p>
                  <ul className="text-muted-foreground space-y-1 text-xs sm:text-sm">
                    <li>✓ Siga as tarefas em ordem e marque cada uma ao completar</li>
                    <li>✓ Leia as dicas do dia - elas contêm informações valiosas</li>
                    <li>✓ Seja consistente: resultados aparecem com prática diária</li>
                    <li>✓ Adapte as técnicas à sua realidade, mas não pule dias</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day Selector */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay === 1}
              className="flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 bg-card px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-border">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-lg sm:text-xl font-bold">Dia {currentDay}</span>
            </div>
            
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCurrentDay(Math.min(7, currentDay + 1))}
              disabled={currentDay === 7}
              className="flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Progress */}
          <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 px-2">
            {dailyProgram.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDay(index + 1)}
                aria-label={`Ir para dia ${index + 1}`}
                className={`flex-1 h-2 sm:h-2.5 rounded-full transition-all ${
                  index + 1 === currentDay
                    ? "bg-primary shadow-glow"
                    : index + 1 < currentDay
                    ? "bg-accent"
                    : "bg-secondary"
                }`}
              />
            ))}
          </div>

          {/* Daily Card */}
          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-foreground">{program.title}</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2">
                {program.description}
              </CardDescription>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Progresso do Dia
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    {completedTasks} de {totalTasks} ({Math.round(progress)}%)
                  </span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-lavender transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {program.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
                  >
                    <Checkbox
                      id={`task-${index}`}
                      checked={checkedItems[currentDay]?.[index] || false}
                      onCheckedChange={() => toggleTask(index)}
                      className="mt-1 flex-shrink-0"
                    />
                    <label
                      htmlFor={`task-${index}`}
                      className={`flex-1 cursor-pointer text-sm sm:text-base leading-relaxed ${
                        checkedItems[currentDay]?.[index]
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task}
                    </label>
                  </div>
                ))}
              </div>

              {/* Day Tip */}
              {program.tip && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    {program.tip}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Motivational Images */}
          {(currentDay === 1 || currentDay === 7) && (
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <img 
                src={sleepRoutineImage} 
                alt="Rotina de sono saudável"
                className="w-full h-48 object-cover rounded-lg shadow-soft"
              />
              <img 
                src={healthyLifestyleImage} 
                alt="Estilo de vida saudável"
                className="w-full h-48 object-cover rounded-lg shadow-soft"
              />
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center space-y-3">
            <p className="text-sm sm:text-base text-muted-foreground px-4 leading-relaxed">
              🌙 Lembre-se: consistência é a chave para o sucesso. Cada dia concluído é um passo 
              em direção a noites tranquilas e dias energizados!
            </p>
            {currentDay === 7 && completedTasks === totalTasks && (
              <p className="text-base sm:text-lg font-semibold text-primary">
                🎉 Parabéns por completar o programa de 7 dias! Continue praticando suas técnicas favoritas.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Projeto7Dias;
