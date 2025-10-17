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
      title: "Estabelecendo a Base: O Ritmo Circadiano",
      description: "A consistência é o alicerce do bom sono. A regularidade alinha seu Ritmo Circadiano, o relógio biológico que sinaliza quando dormir e acordar.",
      tasks: [
        "Horário Fixo: Defina um horário para dormir e acordar (Mantenha o mesmo nos fins de semana para alinhar o Ritmo Circadiano)",
        "Corte de Cafeína: Evite cafeína (café, chás, refrigerantes, chocolate) após às 14h (Meia-vida longa: a cafeína bloqueia o sono por muitas horas)",
        "Regra das Telas: Desligue telas (celular, TV, tablet) 1 hora antes de dormir (A luz azul suprime a produção de Melatonina, o hormônio do sono)",
        "Banho Morno: Tome um banho morno 30-60 minutos antes de deitar (O resfriamento corporal posterior ao banho induz o sono)",
        "Ambiente Ideal: Prepare o quarto: escuro, silencioso e temperatura entre 18-22°C (A temperatura baixa sinaliza ao cérebro que é hora de descansar)",
        "Diário do Sono: Anote a hora que deitou, dormiu e acordou para acompanhar o padrão de sono"
      ],
      tip: "💡 Use um despertador real e deixe o celular fora do quarto. Isso elimina a tentação de scrolling noturno e a exposição à luz azul."
    },
    {
      day: 2,
      title: "O Poder da Rotina Noturna",
      description: "Criar um ritual noturno previsível sinaliza ao cérebro que é hora de desacelerar, reduzindo a ansiedade noturna e preparando o corpo para o repouso.",
      tasks: [
        "Consistência: Mantenha rigorosamente os horários fixos estabelecidos no dia 1 (Reforça o Ritmo Circadiano)",
        "Respiração: Pratique 10 minutos de respiração profunda ou meditação guiada (Ativa o Sistema Nervoso Parassimpático, o 'modo descanso')",
        "Atividade Calmante: De 20 a 30 minutos antes de deitar, realize uma atividade de baixo estímulo, como ler um livro físico (Evita a ruminação mental)",
        "Digestão: Evite refeições pesadas, picantes ou gordurosas 3 horas antes de dormir (O corpo prioriza a digestão, não o sono)",
        "Planejamento Calmo: Prepare seus itens (roupa, bolsa) para o dia seguinte (Reduz a ansiedade matinal e noturna)",
        "Hidratação: Mantenha uma garrafa d'água, mas reduza a ingestão de líquidos 2 horas antes de deitar (Evita o despertar noturno para ir ao banheiro)"
      ],
      tip: "💡 Faça do seu ritual noturno uma sequência que você possa desfrutar. É um momento de autocuidado, não apenas uma tarefa."
    },
    {
      day: 3,
      title: "Exercício, Luz e Energia",
      description: "Exercícios regulares melhoram a qualidade do sono. A exposição à luz natural matinal é crucial para 'dar corda' ao relógio biológico.",
      tasks: [
        "Exercício Diário: Dedique 30 minutos a algum exercício aeróbico leve ou moderado durante o dia (Melhora a eficiência e a profundidade do sono)",
        "Luz Matinal: Exponha-se à luz natural (sol) logo ao acordar (A luz é o sinal mais potente para regular o Ritmo Circadiano)",
        "Limite de Exercício: Evite exercícios intensos 3 horas antes do horário de dormir (Aumentam a temperatura corporal e liberam adrenalina, dificultando o sono)",
        "Alongamento: Pratique 5-10 minutos de alongamento suave antes de deitar (Alivia a tensão muscular e promove o relaxamento)",
        "Chá Relaxante: Tome um chá sem cafeína (camomila, valeriana ou passiflora/maracujá) (Ajuda a acalmar o sistema nervoso)"
      ],
      tip: "💡 Se for se exercitar à noite, espere 2-3h antes de dormir para que a temperatura corporal e a frequência cardíaca voltem ao normal."
    },
    {
      day: 4,
      title: "Acalmando a Mente Ansiosa",
      description: "Uma mente calma adormece mais rápido. Técnicas de relaxamento e mindfulness reduzem a ruminação mental, o maior inimigo do sono.",
      tasks: [
        "Meditação Diurna: Medite ou pratique mindfulness por 10-15 minutos durante o dia (Fortalece a capacidade de acalmar a mente à noite)",
        "Despejo Mental: Faça uma lista de tarefas ou preocupações 1-2 horas antes de dormir e deixe-a fora do quarto (Evita levar os problemas para a cama)",
        "Paz Noturna: Evite discussões, filmes violentos ou decisões importantes à noite (Altas emoções ativam o cérebro)",
        "Áudio Calmante: Ouça música instrumental calma (60-80 BPM) ou podcasts relaxantes enquanto se prepara (Reduz o estado de alerta)",
        "Aromaterapia: Use aromaterapia com lavanda (difusor, spray de travesseiro, óleo) (A lavanda tem efeitos ansiolíticos e sedativos leves)",
        "Técnica 4-7-8: Pratique a respiração 4-7-8 (ou outra técnica de respiração) já na cama (É um 'tranquilizante natural' para o sistema nervoso)"
      ],
      tip: "💡 Se não conseguir dormir após 20 minutos, levante-se e faça uma atividade calma (ler) em outro cômodo até sentir sono, depois volte. (Evita associar a cama à frustração)."
    },
    {
      day: 5,
      title: "Nutrição e Sono: A Química do Descanso",
      description: "O que você come e bebe influencia a produção de Melatonina e Serotonina. A nutrição correta é um apoio químico ao seu sono.",
      tasks: [
        "Álcool Zero: Evite totalmente o álcool à noite (O álcool fragmenta o sono, especialmente o Sono REM e o Sono Profundo)",
        "Triptofano: Inclua alimentos ricos em triptofano (leite, aveia, banana, nozes, peru) no jantar (O triptofano é precursor da Serotonina e Melatonina)",
        "Lanche Leve: Se a fome incomodar, faça um lanche muito leve (banana com mel, leite morno, iogurte) (Evita o despertar por fome sem forçar a digestão)",
        "Magnésio: Considere alimentos ricos em magnésio (folhas verdes, sementes) no jantar (O magnésio ajuda a relaxar músculos e o sistema nervoso)",
        "Açúcar e Gordura: Evite grandes quantidades de açúcar e gordura à noite (Podem causar picos de energia e refluxo)",
        "Consistência: Mantenha todas as práticas dos 4 dias anteriores, especialmente os horários fixos e o corte de telas (Garante a eficácia do programa)"
      ],
      tip: "💡 Consulte um médico ou nutricionista sobre suplementos como Magnésio ou Melatonina. Não se auto-medique, use-os apenas com orientação."
    },
    {
      day: 6,
      title: "O Santuário do Quarto",
      description: "Seu ambiente de sono deve ser otimizado. Otimizar a 'higiene do sono' do quarto pode melhorar a qualidade do sono em até 50%.",
      tasks: [
        "Temperatura: Confirme a temperatura do quarto para 18-22°C (A temperatura central deve cair para o sono de qualidade)",
        "Escuridão Total: Use cortinas blackout, máscara de dormir ou fitas escuras em LEDs (Até pequenas luzes podem interromper o sono profundo)",
        "Silêncio/Ruído: Use protetores auriculares ou ruído branco (ventilador, app de sons) para mascarar ruídos imprevisíveis (O ruído branco é constante e não desperta)",
        "Eletrônicos Fora: Remova todos os eletrônicos do campo de visão (TV, celular, tablets) (O quarto é apenas para dormir)",
        "Conforto: Avalie seu colchão e travesseiro (Devem dar suporte adequado para o alinhamento da coluna)",
        "Roupas de Cama: Use roupa de cama limpa, confortável e que 'respire' (Microclima confortável ajuda a manter a temperatura ideal)"
      ],
      tip: "💡 Treine seu cérebro: use o quarto APENAS para dormir (e intimidade). Nunca trabalhe, coma ou assista TV na cama."
    },
    {
      day: 7,
      title: "Reflexão e Plano de Continuidade",
      description: "Parabéns! É hora de consolidar seus aprendizados. O sucesso a longo prazo reside na identificação e manutenção dos hábitos mais eficazes.",
      tasks: [
        "Revisão do Diário: Revise seu diário de sono da semana (Horários, qualidade, despertares) e encontre padrões",
        "Top 3: Identifique as 3 a 5 práticas (ex: Banho Morno, Sem Cafeína, Despejo Mental) que mais funcionaram para você",
        "Plano de Manutenção: Crie um plano simples e realista para manter essas práticas nas próximas 4 semanas (A consistência é chave)",
        "Metas Futuras: Defina uma meta de sono (ex: 'Dormir 7h30 por noite' ou 'Acordar sem despertador 3x/semana')",
        "Celebração: Reconheça seu progresso e se recompense de forma saudável (Melhora a motivação)",
        "Comprometimento: Assine um 'Contrato do Sono' pessoal para manter a rotina nos fins de semana",
        "Agendamento: Agende uma revisão em 30 dias para avaliar seu progresso contínuo e ajustar o plano"
      ],
      tip: "💡 O objetivo não é ser perfeito, mas ser consistente. Hábito levam tempo para se consolidarem. Siga em frente!"
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
