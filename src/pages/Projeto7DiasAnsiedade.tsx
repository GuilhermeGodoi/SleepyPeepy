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
      title: "Reconhecendo e Mapeando a Ansiedade",
      description: "O primeiro passo é reconhecer a ansiedade sem julgamento e mapear seus gatilhos. Observar o padrão é o início do controle.",
      tasks: [
        "Mapeamento: Liste 3 situações (gatilhos) que consistentemente desencadeiam sua ansiedade (Conhecer o inimigo)",
        "Respiração Matinal: Pratique 5 minutos de respiração diafragmática logo ao acordar (Aciona o 'modo calma')",
        "Diário de Pensamentos: Anote pensamentos ansiosos com o máximo de detalhes, sem julgamento (Tirar o pensamento da mente)",
        "Regulação Química: Evite cafeína após 14h (A cafeína é um estimulante que mimetiza a crise de ansiedade)",
        "Movimento Leve: Caminhe 15 minutos ao ar livre (A luz natural e o movimento ajudam a regular o humor)",
        "Intenção: Defina uma intenção para o dia ('Hoje, eu serei gentil comigo')"
      ],
      tip: "💡 Ansiedade não é fraqueza, é apenas o seu sistema de alarme interno hiperativo. Acolha a emoção antes de tentar mudá-la."
    },
    {
      day: 2,
      title: "Respiração: O Ancoramento Imediato",
      description: "A respiração é sua ferramenta mais rápida e acessível. Técnicas corretas manipulam o Sistema Nervoso, reduzindo os batimentos cardíacos e a adrenalina.",
      tasks: [
        "Técnica 4-7-8: Pratique a respiração 4-7-8 ao acordar e antes de dormir (Induz o estado de relaxamento rapidamente)",
        "Pausas Conscientes: Faça 3 pausas de 2 minutos para respirar profundamente durante momentos de estresse (Interrompe o ciclo de 'luta ou fuga')",
        "Meditação Guiada: Siga uma meditação de 10 minutos focada na respiração (Fortalece o músculo da atenção plena)",
        "Âncora Olfativa: Associe um aroma calmante (lavanda, hortelã) à sua respiração profunda (Cria um gatilho de calma instantâneo)"
      ],
      tip: "💡 Ao sentir a ansiedade subindo, concentre-se na expiração. Expirar mais lentamente que a inspiração é a chave para acalmar o sistema nervoso."
    },
    {
      day: 3,
      title: "Movimento e Liberação de Tensão",
      description: "O exercício libera endorfinas (analgésicos naturais) e queima o excesso de adrenalina/cortisol gerado pela ansiedade. Movimento é uma 'válvula de escape' química.",
      tasks: [
        "Aeróbico Terapêutico: Faça 30 minutos de exercício rítmico (caminhada rápida, corrida, dança) (Libera neurotransmissores do bem-estar)",
        "Alongamento: Alongue-se por 10 minutos focando em ombros, pescoço e costas (Locais onde a ansiedade armazena tensão)",
        "Alternativa Calma: Experimente uma aula de Yoga ou Tai Chi (Foco em coordenação e respiração, tirando o foco da ruminação)",
        "Quebra de Padrão: A cada hora sentado, levante e faça uma pausa ativa de 2 minutos (Muda a fisiologia e o estado mental)",
        "Relaxamento Muscular Progressivo: Tense e relaxe cada grupo muscular antes de dormir (Ajuda a identificar e liberar a tensão física)"
      ],
      tip: "💡 Movimente-se ao ar livre para um efeito duplo: exercício + natureza (conexão com o ambiente) reduzem a ansiedade de forma sinérgica."
    },
    {
      day: 4,
      title: "Mindfulness: O Antídoto para o Futuro",
      description: "Ansiedade é a preocupação excessiva com o futuro. O Mindfulness te 'ancora' no presente, o único lugar onde a ação é possível.",
      tasks: [
        "Meditação do Presente: Medite 15 minutos com foco nas sensações do corpo (Traz a atenção do pensamento para o físico)",
        "Conexão 5-4-3-2-1: Durante picos de ansiedade, use a técnica para focar nos 5 sentidos (Interrompe a espiral de pensamentos)",
        "Alimentação Consciente: Coma uma refeição com total atenção: saboreie, sinta o cheiro e a textura (Pratica a presença em algo simples)",
        "Observação Neutra: Observe pensamentos ansiosos como 'nuvens passando' sem se prender a eles (Distingue você de seus pensamentos)",
        "Body Scan Guiado: Faça um escaneamento corporal de 10 minutos antes de dormir (Aumenta a consciência corporal e relaxamento)"
      ],
      tip: "💡 Quando a ansiedade vier, pergunte: 'O que está acontecendo comigo AGORA?' e 'O que estou fazendo AGORA?'. Volte a focar na ação presente."
    },
    {
      day: 5,
      title: "Reestruturação Cognitiva: O Questionamento",
      description: "Pensamentos ansiosos são, muitas vezes, distorções. Aprender a questionar sua validade é essencial para desarmar a ansiedade.",
      tasks: [
        "Identificação: Escolha um pensamento ansioso recorrente e escreva-o (Torna o pensamento externo e tangível)",
        "Verificação: Pergunte: 'Quais são as EVIDÊNCIAS a favor e contra esse pensamento?' (Busca por fatos vs. emoções)",
        "Descatastrofização: Pergunte: 'Qual é o pior cenário possível? E se isso acontecer, o que eu faria?' (Reduz o medo do desconhecido)",
        "Reescrita Compassiva: Reescreva o pensamento de forma mais equilibrada e gentil (Substitui a voz crítica pela de apoio)",
        "Afirmação Realista: Crie 3 afirmações positivas baseadas em suas forças e conquistas passadas (Reforça a capacidade de lidar com o estresse)"
      ],
      tip: "💡 Pensamento: 'Vou estragar tudo'. Reestruturação: 'Estou sentindo medo, mas tenho as habilidades necessárias. Farei o meu melhor, e se errar, aprenderei.'"
    },
    {
      day: 6,
      title: "Conexão e Higiene Mental",
      description: "O isolamento e o excesso de informação (notícias, redes sociais) amplificam a ansiedade. Priorize conexões humanas e atividades restauradoras.",
      tasks: [
        "Conexão Social: Converse com alguém de confiança (amigo, familiar) sobre algo positivo (Alivia a carga emocional e reforça o apoio)",
        "Escrita Expressiva: Escreva em um diário por 15 minutos sobre suas emoções e o que você precisa liberar (Organiza o caos interno)",
        "Desconexão Digital: Limite o tempo de redes sociais a 30 minutos (Reduz o estresse da comparação e a sobrecarga de informações)",
        "Hobby Terapêutico: Dedique 30 minutos a um hobby prazeroso (música, arte, jardinagem) (Envolve a mente em um fluxo positivo)",
        "Gentileza: Faça um ato de gentileza para um estranho ou colega (Focar nos outros reduz a auto-absorção ansiosa)",
        "Humor: Assista ou leia algo genuinamente engraçado por 20 minutos (O riso é um poderoso relaxante muscular e mental)"
      ],
      tip: "💡 O seu cérebro ansioso busca perigo. Evite notícias e temas negativos 1 hora antes de dormir para não alimentar a ruminação noturna."
    },
    {
      day: 7,
      title: "Integração e Plano de Manutenção",
      description: "Parabéns! Você completou 7 dias de práticas. Agora é hora de consolidar o aprendizado e criar um plano de longo prazo.",
      tasks: [
        "Revisão: Revise o diário da semana e identifique as 3 práticas mais eficazes para o seu caso (Foco no que funciona)",
        "Plano Diário: Crie um plano simples com suas 3-5 técnicas favoritas para praticar todos os dias (Garante a consistência)",
        "Kit de Emergência: Liste 5 ações específicas para fazer durante uma crise aguda (Ex: Respirar 4-7-8, Tomar água, Ligar para X)",
        "Metas Realistas: Defina 2-3 metas de bem-estar mental para o próximo mês (Mantém o foco no crescimento)",
        "Reconhecimento: Celebre seu esforço e progresso (Reforça o comportamento positivo)",
        "Ajuda Profissional: Se a ansiedade estiver limitando sua vida, comprometa-se a buscar um psicólogo ou psiquiatra (Aceitar ajuda é força)",
        "Compartilhe o Aprendizado: Compartilhe uma dica que funcionou com alguém que você se importa (Reforça o seu próprio aprendizado)"
      ],
      tip: "💡 A recuperação é um processo, não um evento. Haverá dias difíceis, e tudo bem. A autocompaixão é a ferramenta mais importante a longo prazo."
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
                className={`flex-1 h-2 sm:h-2.5 rounded-full transition-all ${index + 1 === currentDay
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
                      className={`flex-1 cursor-pointer text-sm sm:text-base leading-relaxed ${checkedItems[currentDay]?.[index]
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
