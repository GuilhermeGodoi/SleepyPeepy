import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Leaf, Moon, ShoppingCart } from "lucide-react";
import melatonina from "@/assets/melatonina.jpg";
import valeriana from "@/assets/valeriana.jpg";
import magnesio from "@/assets/magnesio.jpg";
import oleoEssencial from "@/assets/oleo-essencial.jpg";
import mascaraSono from "@/assets/mascara-sono.jpg";

const Produtos = () => {
  const products = [
    {
      title: "Melatonina",
      category: "Suplemento",
      image: melatonina,
      icon: Moon,
      description: "Hormônio natural do sono",
      dosage: "3-5mg, 30 minutos antes de dormir",
      benefits: [
        "Regula o ciclo circadiano",
        "Reduz o tempo para adormecer",
        "Melhora qualidade do sono"
      ],
      type: "natural",
      priceFrom: 89.90,
      priceTo: 59.90,
      inStock: true
    },
    {
      title: "Valeriana",
      category: "Fitoterápico",
      image: valeriana,
      icon: Leaf,
      description: "Planta medicinal sedativa",
      dosage: "300-600mg, 1-2 horas antes de dormir",
      benefits: [
        "Reduz ansiedade naturalmente",
        "Promove relaxamento",
        "Sem dependência química"
      ],
      type: "natural",
      priceFrom: 69.90,
      priceTo: 44.90,
      inStock: false
    },
    {
      title: "Magnésio",
      category: "Mineral",
      image: magnesio,
      icon: Pill,
      description: "Mineral essencial relaxante",
      dosage: "200-400mg antes de dormir",
      benefits: [
        "Relaxa músculos e nervos",
        "Melhora qualidade do sono",
        "Reduz estresse e ansiedade"
      ],
      type: "natural",
      priceFrom: 79.90,
      priceTo: 54.90,
      inStock: true
    },
    {
      title: "Óleo Essencial de Lavanda",
      category: "Aromaterapia",
      image: oleoEssencial,
      icon: Leaf,
      description: "Aromaterapia relaxante",
      dosage: "2-3 gotas no difusor ou travesseiro",
      benefits: [
        "Efeito calmante imediato",
        "Reduz ansiedade",
        "Melhora ambiente para dormir"
      ],
      type: "natural",
      priceFrom: 99.90,
      priceTo: 69.90,
      inStock: true
    },
    {
      title: "Máscara de Sono",
      category: "Acessório",
      image: mascaraSono,
      icon: Moon,
      description: "Bloqueia luz completamente",
      dosage: "Usar durante toda a noite",
      benefits: [
        "Bloqueia luz externa",
        "Aumenta produção de melatonina",
        "Melhora qualidade do sono"
      ],
      type: "accessory",
      priceFrom: 49.90,
      priceTo: 29.90,
      inStock: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-lavender bg-clip-text text-transparent">
              Produtos Recomendados
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Suplementos e produtos naturais que auxiliam em uma melhor noite de sono
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, index) => {
              const Icon = product.icon;
              const discountPercentage = Math.round(((product.priceFrom - product.priceTo) / product.priceFrom) * 100);
              return (
                <Card key={index} className="bg-card border-border shadow-soft overflow-hidden hover:shadow-glow transition-all relative">
                  {!product.inStock && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="destructive" className="text-xs font-semibold">Esgotado</Badge>
                    </div>
                  )}
                  <div className="aspect-video w-full overflow-hidden bg-secondary/30 relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className={`w-full h-full object-cover ${!product.inStock ? 'opacity-60' : ''}`}
                    />
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded-md font-bold text-sm">
                        -{discountPercentage}%
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-xs sm:text-sm text-muted-foreground">{product.category}</span>
                      </div>
                      {product.type === "natural" && (
                        <Badge variant="secondary" className="text-xs">Natural</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-foreground">{product.title}</CardTitle>
                    <CardDescription className="text-sm">{product.description}</CardDescription>
                    
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.priceFrom.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          R$ {product.priceTo.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Dosagem:</span> {product.dosage}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">Benefícios:</h4>
                      <ul className="space-y-2">
                        {product.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-accent mt-0.5">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full mt-4" 
                      disabled={!product.inStock}
                      variant={product.inStock ? "default" : "secondary"}
                    >
                      {product.inStock ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar Agora
                        </>
                      ) : (
                        "Produto Esgotado"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-12 bg-secondary/30 border border-border rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3">⚠️ Aviso Importante</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Consulte sempre um médico ou profissional de saúde antes de iniciar qualquer suplementação. 
              As dosagens mencionadas são referências gerais e podem variar conforme necessidades individuais. 
              Produtos naturais também podem ter contraindicações e interações medicamentosas.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Produtos;
