import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Sobre */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">SleepyPeepy</h3>
            <p className="text-sm text-muted-foreground">
              Seu guia completo para noites melhores e uma vida mais saudável através de técnicas naturais e comprovadas.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/projeto-7-dias" className="text-muted-foreground hover:text-primary transition-colors">
                  Projeto 7 Dias
                </Link>
              </li>
              <li>
                <Link to="/exercicios" className="text-muted-foreground hover:text-primary transition-colors">
                  Exercícios
                </Link>
              </li>
              <li>
                <Link to="/receitas" className="text-muted-foreground hover:text-primary transition-colors">
                  Receitas
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-muted-foreground hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Contato</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Dúvidas ou sugestões?
            </p>
            <a 
              href="mailto:contato@sleepypeepy.site" 
              className="text-sm text-primary hover:underline"
            >
              contato@sleepypeepy.site
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SleepyPeepy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
