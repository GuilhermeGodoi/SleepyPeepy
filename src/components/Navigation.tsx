import { Link, useLocation } from "react-router-dom";
import { Moon, Home, Calendar, Dumbbell, Coffee, ShoppingBag, Brain, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const links = [
    { to: "/", label: "Início", icon: Home },
    { to: "/Projeto7DiasAnsiedade", label: "Ansiedade", icon: Brain, variant: "anxiety" },
    { to: "/projeto-7-dias", label: "Sono", icon: Moon, variant: "sleep" },
    { to: "/exercicios", label: "Exercícios", icon: Dumbbell },
    { to: "/receitas", label: "Receitas", icon: Coffee },
    { to: "/produtos", label: "Produtos", icon: ShoppingBag },
  ];

  const getVariantClasses = (variant?: string, isActive?: boolean) => {
    if (variant === "anxiety") {
      return isActive 
        ? "bg-purple-500/20 text-purple-300 border-purple-500/30" 
        : "hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500/20";
    }
    if (variant === "sleep") {
      return isActive 
        ? "bg-blue-500/20 text-blue-300 border-blue-500/30" 
        : "hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/20";
    }
    return "";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Moon className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold bg-gradient-lavender bg-clip-text text-transparent">
              MenteCalma
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all border border-transparent",
                    "hover:bg-secondary hover:shadow-glow",
                    isActive && "bg-secondary text-primary shadow-glow",
                    getVariantClasses(link.variant, isActive)
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-2 mt-8">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all border border-transparent",
                        "hover:bg-secondary",
                        isActive && "bg-secondary text-primary",
                        getVariantClasses(link.variant, isActive)
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-base font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
