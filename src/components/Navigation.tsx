import { Link, useLocation } from "react-router-dom";
import { Moon, Home, Calendar, Dumbbell, Coffee, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const links = [
    { to: "/", label: "Início", icon: Home },
    { to: "/projeto-7-dias", label: "7 Dias", icon: Calendar },
    { to: "/exercicios", label: "Exercícios", icon: Dumbbell },
    { to: "/receitas", label: "Receitas", icon: Coffee },
    { to: "/produtos", label: "Produtos", icon: ShoppingBag },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Moon className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="hidden sm:inline text-xl font-bold bg-gradient-lavender bg-clip-text text-transparent">
              SonoVital
            </span>
          </Link>
          
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                    "hover:bg-secondary hover:shadow-glow",
                    isActive && "bg-secondary text-primary shadow-glow"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
