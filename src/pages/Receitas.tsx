import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Leaf } from "lucide-react";

/* ===== Imagens (use a extensão real do seu projeto) ===== */
import imgCascaLaranjaCamomila from "@/assets/chas/casca_laranja_camomila.png";
import imgFolhasDeMaracuja from "@/assets/chas/folhas_de_maracuja.png";
import imgLeiteAmendoasMel from "@/assets/chas/leite_amendoas_mel.png";
import imgRosasMel from "@/assets/chas/rosas_mel.png";
import imgSucoCereja from "@/assets/chas/suco_cereja.png";
import imgVerbena from "@/assets/chas/verbena.png";
import imgAveiaMel from "@/assets/chas/aveia_mel.png";
import imgRooibosBaunilha from "@/assets/chas/rooibos_baunilha.png"; // (rooibos) arquivo conforme sua lista
import imgCamomila from "@/assets/chas/Camomila.png";
import imgCevada from "@/assets/chas/cevada.png";
import imgCidreira from "@/assets/chas/cidreira.png";
import imgErvaDoce from "@/assets/chas/erva_doce.png";
import imgHortela from "@/assets/chas/hortela.png";
import imgLavanda from "@/assets/chas/lavanda.png";
import imgLeiteComCanela from "@/assets/chas/leite_com_canela.png";
import imgLeiteDourado from "@/assets/chas/leite_dourado.png";
import imgMacaCanela from "@/assets/chas/maca_canela.png";
import imgMacela from "@/assets/chas/macela.png";
import imgMulungu from "@/assets/chas/mulungu.png";
import imgValeriana from "@/assets/chas/valeriana.png";

const Receitas = () => {
  const recipes = [
    /* ===== As 4 primeiras já existentes ===== */
    {
      title: "Chá de Camomila",
      category: "Chá",
      image: imgCamomila,
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
      benefits: "Ajuda a reduzir ansiedade e relaxar"
    },
    {
      title: "Leite Dourado",
      category: "Bebida",
      image: imgLeiteDourado,
      description: "Bebida morna anti-inflamatória",
      ingredients: [
        "250ml de leite (vegetal ou animal)",
        "1 colher de chá de cúrcuma (açafrão-da-terra)",
        "1 pitada de pimenta-preta",
        "Mel a gosto"
      ],
      instructions: [
        "Aqueça o leite em fogo médio",
        "Adicione a cúrcuma e a pimenta",
        "Mexa até ficar homogêneo",
        "Adoce com mel antes de servir"
      ],
      benefits: "Conforto corporal e sensação de calma"
    },
    {
      title: "Chá de Lavanda",
      category: "Chá",
      image: imgLavanda,
      description: "Aroma floral relaxante",
      ingredients: [
        "1 colher de chá de flores de lavanda secas",
        "250ml de água fervente",
        "Mel (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as flores de lavanda",
        "Infunda por 4-5 minutos",
        "Coe e sirva quente"
      ],
      benefits: "Ajuda a aliviar o estresse"
    },
    {
      title: "Chá de Maracujá (Folhas)",
      category: "Chá",
      image: imgFolhasDeMaracuja,
      description: "Calmante suave tradicional",
      ingredients: [
        "2 colheres de sopa de folhas de maracujá secas",
        "250ml de água fervente",
        "Rodela de limão (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as folhas",
        "Infunda por 8-10 minutos",
        "Coe e sirva"
      ],
      benefits: "Apoia o relaxamento noturno"
    },

    /* ===== Restante com imagens alinhadas à sua lista ===== */
    {
      title: "Chá de Melissa (Erva-cidreira)",
      category: "Chá",
      image: imgCidreira,
      description: "Acalma e suaviza a tensão",
      ingredients: [
        "2 colheres de chá de folhas de melissa",
        "250ml de água fervente",
        "Mel a gosto"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as folhas",
        "Infunda por 8-10 minutos",
        "Coe e adoce"
      ],
      benefits: "Sensação de bem-estar e tranquilidade"
    },
    {
      title: "Leite com Canela",
      category: "Bebida",
      image: imgLeiteComCanela,
      description: "Conforto morno e aromático",
      ingredients: [
        "250ml de leite morno",
        "1 pau de canela",
        "1 colher de chá de mel",
        "Noz-moscada (pitada, opcional)"
      ],
      instructions: [
        "Aqueça o leite com o pau de canela por 3 minutos",
        "Retire a canela",
        "Adoce e finalize com noz-moscada"
      ],
      benefits: "Aconchego antes de dormir"
    },
    {
      title: "Chá de Erva-Cidreira Fresca",
      category: "Chá",
      image: imgCidreira,
      description: "Aromático e relaxante",
      ingredients: [
        "2 colheres de sopa de folhas frescas",
        "250ml de água fervente",
        "Rodelas de limão-siciliano (opcional)"
      ],
      instructions: [
        "Ferva a água",
        "Adicione as folhas amassadas de leve",
        "Infunda por 5-8 minutos",
        "Coe e sirva"
      ],
      benefits: "Ajuda em noites agitadas"
    },
    {
      title: "Suco de Cereja (sem açúcar)",
      category: "Suco",
      image: imgSucoCereja,
      description: "Opção fria pré-sono",
      ingredients: [
        "200g de cerejas frescas ou congeladas",
        "150ml de água",
        "Gelo (opcional)"
      ],
      instructions: [
        "Descaroce as cerejas",
        "Bata com a água",
        "Coe se preferir e sirva"
      ],
      benefits: "Bebida leve para rotina noturna"
    },
    {
      title: "Chá de Hortelã",
      category: "Chá",
      image: imgHortela,
      description: "Refrescante e digestivo",
      ingredients: [
        "10-12 folhas de hortelã fresca",
        "250ml de água fervente"
      ],
      instructions: [
        "Ferva a água",
        "Macere levemente as folhas",
        "Infunda por 5 minutos, coe e sirva"
      ],
      benefits: "Ajuda a aliviar desconfortos e tensão"
    },
    {
      title: "Leite de Amêndoas com Mel",
      category: "Bebida",
      image: imgLeiteAmendoasMel,
      description: "Leve e reconfortante",
      ingredients: [
        "250ml de leite de amêndoas",
        "1 colher de sopa de mel",
        "1 pitada de cardamomo",
        "2 gotas de essência de baunilha"
      ],
      instructions: [
        "Aqueça o leite",
        "Misture mel, cardamomo e baunilha",
        "Sirva morno"
      ],
      benefits: "Textura suave que acalma"
    },
    {
      title: "Chá de Mulungu",
      category: "Chá",
      image: imgMulungu,
      description: "Tradicional no Brasil",
      ingredients: [
        "1 colher de sopa de casca de mulungu",
        "250ml de água",
        "Mel a gosto"
      ],
      instructions: [
        "Ferva a casca em água por 5 minutos",
        "Desligue e infunda por mais 5",
        "Coe e adoce"
      ],
      benefits: "Uso noturno para desacelerar"
    },

    /* ===== Novas receitas (10+) ===== */
    {
      title: "Chá de Erva-Doce (Funcho)",
      category: "Chá",
      image: imgErvaDoce,
      description: "Doce, leve e calmante",
      ingredients: [
        "1 colher de chá de sementes de erva-doce",
        "250ml de água fervente"
      ],
      instructions: [
        "Amasse levemente as sementes",
        "Infunda em água fervente por 6-8 minutos",
        "Coe e sirva"
      ],
      benefits: "Contribui para relaxar e aliviar gases"
    },
    {
      title: "Rooibos com Baunilha",
      category: "Chá",
      image: imgRooibosBaunilha,
      description: "Sem cafeína e aconchegante",
      ingredients: [
        "1 sachê ou 1 colher de chá de rooibos",
        "250ml de água fervente",
        "Gotas de essência de baunilha (opcional)"
      ],
      instructions: [
        "Infunda o rooibos por 5-7 minutos",
        "Aromatize com baunilha",
        "Sirva puro ou com mel"
      ],
      benefits: "Perfil doce natural, ideal à noite"
    },
    {
      title: "Chá de Maçã com Canela",
      category: "Chá",
      image: imgMacaCanela,
      description: "Conforto frutado",
      ingredients: [
        "1 maçã em fatias",
        "1 pau de canela",
        "300ml de água"
      ],
      instructions: [
        "Ferva água com a maçã e a canela por 5 minutos",
        "Desligue, tampe e infunda por 5 minutos",
        "Coe e sirva"
      ],
      benefits: "Aroma aconchegante que acalma"
    },
    {
      title: "Casca de Laranja & Camomila",
      category: "Chá",
      image: imgCascaLaranjaCamomila,
      description: "Cítrico suave com floral",
      ingredients: [
        "1 tira de casca de laranja (sem parte branca)",
        "1 colher de chá de camomila",
        "250ml de água fervente"
      ],
      instructions: [
        "Infunda tudo por 5-6 minutos",
        "Coe e sirva",
        "Adoce se desejar"
      ],
      benefits: "Leve e perfumado para a noite"
    },
    {
      title: "Verbena (Lúcia-lima)",
      category: "Chá",
      image: imgVerbena,
      description: "Erva cítrica relaxante",
      ingredients: [
        "1 colher de chá de verbena seca",
        "250ml de água fervente"
      ],
      instructions: [
        "Infunda por 5-7 minutos",
        "Coe e sirva"
      ],
      benefits: "Ajuda a desacelerar o ritmo mental"
    },
    {
      title: "Chá de Valeriana",
      category: "Chá",
      image: imgValeriana,
      description: "Tradicional para a noite",
      ingredients: [
        "1 colher de chá de raiz de valeriana seca",
        "250ml de água quente (não fervente)"
      ],
      instructions: [
        "Despeje água quente sobre a valeriana",
        "Infunda por 10 minutos",
        "Coe e sirva"
      ],
      benefits: "Opção clássica pré-sono"
    },
    {
      title: "Água de Aveia Morna com Mel",
      category: "Bebida",
      image: imgAveiaMel,
      description: "Textura suave, leve para o estômago",
      ingredients: [
        "1 colher de sopa de aveia fina",
        "250ml de água",
        "1 colher de chá de mel"
      ],
      instructions: [
        "Aqueça água e aveia por 3-4 minutos, mexendo",
        "Coe para ficar mais leve",
        "Adoce com mel e sirva morno"
      ],
      benefits: "Sensação de saciedade e conforto"
    },
    {
      title: "Cevada Morna (Café de Cevada)",
      category: "Bebida",
      image: imgCevada,
      description: "Alternativa sem cafeína",
      ingredients: [
        "1 colher de chá de pó de cevada torrada",
        "200ml de água quente",
        "Leite a gosto (opcional)"
      ],
      instructions: [
        "Dissolva a cevada em água quente",
        "Complete com um pouco de leite se quiser",
        "Sirva imediatamente"
      ],
      benefits: "Sabor parecido com café, mas noturno"
    },
    {
      title: "Chá de Rosas com Mel",
      category: "Chá",
      image: imgRosasMel,
      description: "Floral delicado",
      ingredients: [
        "1 colher de chá de pétalas de rosa comestíveis secas",
        "250ml de água quente",
        "Mel a gosto"
      ],
      instructions: [
        "Infunda as pétalas por 5 minutos",
        "Coe e adoce levemente"
      ],
      benefits: "Aroma suave que acalma"
    },
    {
      title: "Chá de Hibisco Suave com Maçã",
      category: "Chá",
      image: imgMacaCanela, // provisório — ajuste se tiver uma imagem própria de hibisco
      description: "Levemente ácido e relaxante",
      ingredients: [
        "1 colher de chá de hibisco",
        "3 fatias de maçã",
        "300ml de água quente"
      ],
      instructions: [
        "Infunda hibisco e maçã por 4-5 minutos",
        "Coe e sirva morno"
      ],
      benefits: "Refrescante sem estimulantes"
    },
    {
      title: "Chá de Macela (Camomila Gaúcha)",
      category: "Chá",
      image: imgMacela,
      description: "Tradicional no sul do Brasil",
      ingredients: [
        "1 colher de chá de flores de macela",
        "250ml de água quente"
      ],
      instructions: [
        "Infunda por 5-7 minutos",
        "Coe e sirva"
      ],
      benefits: "Perfil semelhante à camomila, reconfortante"
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
                    loading="lazy"
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
              💡 Dica: Consuma essas bebidas 30–60 minutos antes de dormir. Evite cafeína à noite.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Receitas;
