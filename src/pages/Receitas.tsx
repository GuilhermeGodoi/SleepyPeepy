import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Leaf } from "lucide-react";
import chaCamomila from "@/assets/cha-camomila.jpg";
import leiteDourado from "@/assets/leite-dourado.jpg";
import chaLavanda from "@/assets/cha-lavanda.jpg";
import chaMaracuja from "@/assets/cha-maracuja.jpg";
import smoothieBanana from "@/assets/smoothie-banana.jpg";

const Receitas = () => {
  const recipes = [
    {
      title: "Chá de Camomila",
      category: "Chá",
      image: chaCamomila,
      description: "Clássico calmante natural",
      ingredients: [
        "1 colher de sopa de flores de camomila",
        "250ml de água fervente",
        "Mel a gosto (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as flores de camomila",
        "Deixe em infusão por 5-7 minutos",
        "Coe e adicione mel se desejar"
      ],
      benefits: "Reduz ansiedade e promove relaxamento muscular"
    },
    {
      title: "Leite Dourado",
      category: "Bebida",
      image: leiteDourado,
      description: "Anti-inflamatório natural",
      ingredients: [
        "250ml de leite (vegetal ou animal)",
        "1 colher de chá de açafrão",
        "1 pitada de pimenta preta",
        "Mel a gosto"
      ],
      instructions: [
        "Aqueça o leite em fogo médio",
        "Adicione o açafrão e a pimenta",
        "Mexa bem até ficar homogêneo",
        "Adoce com mel antes de servir"
      ],
      benefits: "Propriedades anti-inflamatórias e relaxantes"
    },
    {
      title: "Chá de Lavanda",
      category: "Chá",
      image: chaLavanda,
      description: "Aroma relaxante e calmante",
      ingredients: [
        "1 colher de chá de flores de lavanda secas",
        "250ml de água fervente",
        "Mel de lavanda (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as flores de lavanda",
        "Deixe em infusão por 4-5 minutos",
        "Coe e sirva quente"
      ],
      benefits: "Alivia estresse e melhora a qualidade do sono"
    },
    {
      title: "Chá de Maracujá",
      category: "Chá",
      image: chaMaracuja,
      description: "Poderoso calmante natural",
      ingredients: [
        "2 colheres de sopa de folhas de maracujá secas",
        "250ml de água fervente",
        "Limão (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as folhas de maracujá",
        "Deixe em infusão por 8-10 minutos",
        "Coe e sirva com limão se desejar"
      ],
      benefits: "Reduz ansiedade e insônia naturalmente"
    },
    {
      title: "Smoothie de Banana",
      category: "Smoothie",
      image: smoothieBanana,
      description: "Rico em magnésio e triptofano",
      ingredients: [
        "1 banana madura",
        "200ml de leite",
        "1 colher de sopa de aveia",
        "1 colher de chá de mel",
        "Canela em pó"
      ],
      instructions: [
        "Congele a banana previamente",
        "Bata todos os ingredientes no liquidificador",
        "Adicione canela por cima",
        "Sirva imediatamente"
      ],
      benefits: "Promove produção de melatonina naturalmente"
    },
    {
      title: "Chá de Melissa",
      category: "Chá",
      image: chaCamomila,
      description: "Alivia tensão e ansiedade",
      ingredients: [
        "2 colheres de chá de folhas de melissa",
        "250ml de água fervente",
        "Mel a gosto"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as folhas de melissa",
        "Deixe em infusão por 10 minutos",
        "Coe e adoce com mel"
      ],
      benefits: "Reduz estresse, melhora humor e qualidade do sono"
    },
    {
      title: "Leite com Canela",
      category: "Bebida",
      image: leiteDourado,
      description: "Bebida reconfortante tradicional",
      ingredients: [
        "250ml de leite morno",
        "1 pau de canela",
        "1 colher de chá de mel",
        "Noz-moscada ralada (opcional)"
      ],
      instructions: [
        "Aqueça o leite com o pau de canela",
        "Deixe ferver levemente por 3 minutos",
        "Retire o pau de canela",
        "Adoce com mel e polvilhe noz-moscada"
      ],
      benefits: "Aquece o corpo e promove sensação de conforto e relaxamento"
    },
    {
      title: "Chá de Erva-Cidreira",
      category: "Chá",
      image: chaLavanda,
      description: "Calmante suave e aromático",
      ingredients: [
        "2 colheres de sopa de folhas frescas",
        "250ml de água fervente",
        "Limão siciliano (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as folhas de erva-cidreira",
        "Deixe em infusão por 5-8 minutos",
        "Coe e adicione rodelas de limão"
      ],
      benefits: "Combate insônia leve e acalma o sistema nervoso"
    },
    {
      title: "Suco de Cereja",
      category: "Suco",
      image: smoothieBanana,
      description: "Rico em melatonina natural",
      ingredients: [
        "200g de cerejas frescas ou congeladas",
        "150ml de água",
        "1 colher de chá de mel",
        "Gelo a gosto"
      ],
      instructions: [
        "Descaroce as cerejas",
        "Bata no liquidificador com água",
        "Coe se preferir",
        "Adoce com mel e sirva gelado"
      ],
      benefits: "Aumenta níveis de melatonina e melhora duração do sono"
    },
    {
      title: "Chá de Hortelã",
      category: "Chá",
      image: chaMaracuja,
      description: "Relaxante digestivo",
      ingredients: [
        "10-12 folhas de hortelã fresca",
        "250ml de água fervente",
        "Limão (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Amasse levemente as folhas",
        "Adicione à água e deixe em infusão por 5 minutos",
        "Coe e sirva"
      ],
      benefits: "Alivia tensão muscular e desconfortos digestivos"
    },
    {
      title: "Leite de Amêndoas com Mel",
      category: "Bebida",
      image: leiteDourado,
      description: "Nutritivo e relaxante",
      ingredients: [
        "250ml de leite de amêndoas",
        "1 colher de sopa de mel",
        "1 pitada de cardamomo",
        "Essência de baunilha"
      ],
      instructions: [
        "Aqueça o leite de amêndoas",
        "Adicione mel e cardamomo",
        "Acrescente 2 gotas de essência de baunilha",
        "Mexa bem e sirva morno"
      ],
      benefits: "Rico em magnésio, promove relaxamento profundo"
    },
    {
      title: "Chá de Mulungu",
      category: "Chá",
      image: chaCamomila,
      description: "Poderoso sedativo natural",
      ingredients: [
        "1 colher de sopa de casca de mulungu",
        "250ml de água",
        "Mel a gosto"
      ],
      instructions: [
        "Ferva a água com a casca de mulungu",
        "Deixe ferver por 5 minutos",
        "Desligue e deixe em infusão por mais 5 minutos",
        "Coe e adoce"
      ],
      benefits: "Combate insônia severa e ansiedade profunda"
    },
    {
      title: "Smoothie de Kiwi",
      category: "Smoothie",
      image: smoothieBanana,
      description: "Rico em serotonina",
      ingredients: [
        "2 kiwis maduros",
        "1 banana",
        "150ml de iogurte natural",
        "1 colher de sopa de sementes de chia",
        "Mel a gosto"
      ],
      instructions: [
        "Descasque os kiwis e a banana",
        "Bata tudo no liquidificador",
        "Adicione as sementes de chia",
        "Deixe descansar 5 minutos antes de servir"
      ],
      benefits: "Alto teor de serotonina melhora regulação do sono"
    },
    {
      title: "Chá de Tília",
      category: "Chá",
      image: chaLavanda,
      description: "Tranquilizante natural europeu",
      ingredients: [
        "1 colher de sopa de flores de tília",
        "250ml de água fervente",
        "Mel de flores"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as flores de tília",
        "Deixe em infusão por 7-10 minutos",
        "Coe e adoce com mel"
      ],
      benefits: "Reduz tensão nervosa e promove sono reparador"
    },
    {
      title: "Leite de Aveia com Açafrão",
      category: "Bebida",
      image: leiteDourado,
      description: "Anti-inflamatório e reconfortante",
      ingredients: [
        "250ml de leite de aveia",
        "1/2 colher de chá de açafrão",
        "1 pitada de gengibre em pó",
        "Mel a gosto"
      ],
      instructions: [
        "Aqueça o leite de aveia",
        "Adicione açafrão e gengibre",
        "Misture bem até ficar dourado",
        "Adoce e sirva morno"
      ],
      benefits: "Combina propriedades calmantes com ação anti-inflamatória"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-lavender bg-clip-text text-transparent">
              Receitas Relaxantes
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Bebidas naturais que ajudam a relaxar e preparar o corpo para o sono
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recipes.map((recipe, index) => (
              <Card key={index} className="bg-card border-border shadow-soft overflow-hidden hover:shadow-glow transition-all">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {recipe.category === "Chá" ? (
                      <Coffee className="h-5 w-5 text-primary" />
                    ) : (
                      <Leaf className="h-5 w-5 text-accent" />
                    )}
                    <span className="text-xs sm:text-sm text-muted-foreground">{recipe.category}</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">{recipe.title}</CardTitle>
                  <CardDescription className="text-sm">{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">Ingredientes:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">Modo de preparo:</h4>
                    <ol className="space-y-1 text-sm text-muted-foreground">
                      {recipe.instructions.map((instruction, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary font-semibold mt-0.5">{i + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs sm:text-sm text-accent font-medium">
                      ✨ {recipe.benefits}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-4">
              💡 Dica: Consuma essas bebidas 30-60 minutos antes de dormir para melhores resultados
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Receitas;
