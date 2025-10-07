import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-foreground mb-2">🍪 Este site usa cookies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. 
              Ao continuar navegando, você concorda com nossa{" "}
              <Link to="/cookies" className="text-primary hover:underline">
                Política de Cookies
              </Link>
              {" "}e{" "}
              <Link to="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={acceptCookies}
              className="w-full sm:w-auto"
            >
              Aceitar Cookies
            </Button>
            <Button
              onClick={declineCookies}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Recusar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
