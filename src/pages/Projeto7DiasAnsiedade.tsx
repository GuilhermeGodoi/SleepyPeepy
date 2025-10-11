import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Calendar, Info } from "lucide-react";
import meditationImage from "@/assets/meditation-peace.jpg";
import breathingImage from "@/assets/breathing-exercises.jpg";

const Projeto7DiasAnsiedade = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean[]>>({});

  const dailyProgram = [
    {
      day: 1,
      title: "Reconhecendo e Acolhendo",
      description: "O primeiro passo para superar a ansiedade é reconhecê-la sem julgamento. Hoje você aprenderá a observar seus pensamentos com compaixão.",
      tasks: [
        "Liste 3 situações que desencadeiam sua ansiedade",
        "Pratique 5 minutos de respiração profunda ao acordar",
        "Anote pensamentos ansiosos sem julgamento",
        "Evite cafeína após 14h",
        "Caminhe 15 minutos ao ar livre"
      ],
      tip: "💡 Lembre-se: ansiedade não é fraqueza. É um sinal de que seu corpo precisa de mais cuidado e atenção."
    },
    {
      day: 2,
      title: "Respiração Consciente",
      description: "A respiração é sua ferramenta mais poderosa contra a ansiedade. Técnicas corretas podem reduzir sintomas em até 60%.",
      tasks: [
        "Pratique respiração 4-7-8 ao acordar (4 repetições)",
        "Faça 3 pausas de 2 minutos para respirar durante o dia",
        "Siga meditação guiada de 10 minutos",
        "Pratique 10 respirações profundas antes de dormir"
      ],
      tip: "💡 Baixe um app de respiração ou use nossa página de exercícios para praticar com um guia visual."
    },
    {
      day: 3,
      title: "Movimento que Libera",
      description: "Exercícios físicos liberam endorfinas e reduzem cortisol (hormônio do estresse) em até 50%. Movimento é medicina natural.",
      tasks: [
        "Faça 30 minutos de exercício aeróbico: caminhada rápida, corrida, natação ou dança",
        "Alongue-se por 10 minutos ao acordar - estique pescoço, braços, costas, pernas",
        "Experimente uma aula de yoga, pilates ou tai chi (online ou presencial)",
        "Escolha escadas em vez de elevador - movimento libera endorfinas",
        "A cada hora sentado, levante e movimente-se por 2 minutos",
        "Dance livremente por 5 minutos ao som da sua playlist favorita",
        "Antes de dormir, tense e relaxe cada grupo muscular por 5 segundos (pés, pernas, abdômen, braços, rosto)"
      ],
      tip: "💡 Exercícios ao ar livre têm efeito duplo: movimento + contato com natureza reduzem ansiedade em 70%."
    },
    {
      day: 4,
      title: "Mindfulness e Presença",
      description: "Ansiedade é medo do futuro. Mindfulness te traz ao presente, onde você está seguro. Pratique estar aqui e agora.",
      tasks: [
        "Medite 15 minutos com guia (apps: Insight Timer, Calm, Headspace, Lojong)",
        "Coma uma refeição com atenção plena: mastigue devagar, saboreie cada garfada",
        "Durante ansiedade, use 5-4-3-2-1: nomeie 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia",
        "Escolha uma tarefa rotineira e faça com total presença (banho, louça, escovar dentes)",
        "Observe pensamentos ansiosos como nuvens que passam - não lute, apenas observe",
        "Faça body scan guiado: escaneie mentalmente corpo dos pés à cabeça (10 min)",
        "Anote 3 momentos do dia em que você estava 100% presente"
      ],
      tip: "💡 Quando a ansiedade vier, pergunte: 'Estou em perigo AGORA?' Geralmente não. Respire e volte ao presente."
    },
    {
      day: 5,
      title: "Reestruturação Cognitiva",
      description: "Pensamentos ansiosos não são fatos. Aprenda a questionar e reformular padrões mentais que alimentam a ansiedade.",
      tasks: [
        "Escolha um pensamento ansioso recorrente e escreva-o exatamente como aparece",
        "Pergunte: 'Isso é um FATO comprovado ou uma INTERPRETAÇÃO/SUPOSIÇÃO?'",
        "Liste 3 evidências concretas que contradizem esse pensamento catastrófico",
        "Reescreva o pensamento de forma equilibrada, realista e compassiva",
        "Fale consigo como falaria com seu melhor amigo - com gentileza e compreensão",
        "Crie 3 afirmações positivas e realistas baseadas em suas conquistas reais",
        "Releia suas reestruturações antes de dormir e observe como se sente"
      ],
      tip: "💡 Pensamento ansioso: 'Vou falhar'. Reestruturação: 'Estou nervoso, mas já me preparei. Farei o meu melhor.'"
    },
    {
      day: 6,
      title: "Conexão e Expressão",
      description: "Ansiedade prospera no isolamento. Conexões genuínas e expressão emocional são antídotos poderosos.",
      tasks: [
        "Converse honestamente com alguém de confiança sobre o que está sentindo",
        "Escreva uma carta para sua ansiedade - diga como ela te afeta e o que você quer dela",
        "Dedique 30 minutos a um hobby prazeroso: pintar, tocar música, cozinhar, jardinagem",
        "Limite redes sociais a 30 minutos hoje - evite comparação e FOMO (medo de ficar de fora)",
        "Faça um ato de gentileza: ajude alguém, envie mensagem carinhosa, elogie sinceramente",
        "Assista ou leia algo engraçado por 20 minutos - rir reduz cortisol e ansiedade",
        "Marque um café, chamada de vídeo ou encontro com alguém querido"
      ],
      tip: "💡 Você não precisa passar por isso sozinho. Compartilhar alivia, conecta e cura. Permita-se ser vulnerável."
    },
    {
      day: 7,
      title: "Integrando e Continuando",
      description: "Parabéns! Você completou 7 dias de práticas anti-ansiedade. Agora é hora de integrar o aprendizado ao seu dia a dia.",
      tasks: [
        "Revise todo o seu diário da semana: quais práticas tiveram mais impacto?",
        "Escolha 3-5 técnicas favoritas e comprometa-se a praticá-las diariamente",
        "Monte um 'Kit de Emergência': o que fazer durante uma crise de ansiedade aguda",
        "Liste seus principais gatilhos e uma estratégia específica para cada",
        "Celebre cada pequena vitória - reconheça a coragem de ter chegado até aqui",
        "Defina 2-3 metas de bem-estar mental realistas para os próximos 30 dias",
        "Se a ansiedade for intensa ou persistente, busque um psicólogo ou psiquiatra",
        "Compartilhe o que aprendeu com alguém que também luta contra a ansiedade"
      ],
      tip: "💡 Recuperação não é linear. Haverá altos e baixos, e tudo bem. Continue praticando com paciência e autocompaixão."
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
              7 Dias para Vencer a Ansiedade
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Um programa completo com técnicas cientificamente comprovadas para reduzir ansiedade. 
              Siga cada dia e transforme sua relação com o medo e a preocupação!
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
                    <li>✓ Pratique as técnicas diariamente, mesmo quando se sentir bem</li>
                    <li>✓ Seja gentil consigo mesmo - progresso não é perfeição</li>
                    <li>✓ Anote suas experiências e observe padrões</li>
                    <li>✓ Não hesite em buscar ajuda profissional se necessário</li>
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
                src={meditationImage} 
                alt="Meditação e paz interior"
                className="w-full h-48 object-cover rounded-lg shadow-soft"
              />
              <img 
                src={breathingImage} 
                alt="Exercícios de respiração"
                className="w-full h-48 object-cover rounded-lg shadow-soft"
              />
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center space-y-3">
            <p className="text-sm sm:text-base text-muted-foreground px-4 leading-relaxed">
              🧘 Lembre-se: você é mais forte que sua ansiedade. Cada pequeno passo conta, 
              e você está fazendo um trabalho incrível!
            </p>
            {currentDay === 7 && completedTasks === totalTasks && (
              <p className="text-base sm:text-lg font-semibold text-primary">
                🎉 Parabéns por completar os 7 dias! Continue praticando e cuidando da sua saúde mental.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Projeto7DiasAnsiedade;
