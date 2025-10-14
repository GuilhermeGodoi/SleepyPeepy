import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 pb-12 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-lavender bg-clip-text text-transparent">
              Política de Cookies
            </h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <Card className="bg-card border-border shadow-soft">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <section>
                <CardTitle className="text-xl mb-3">1. O que são Cookies?</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, 
                  smartphone ou tablet) quando você visita um site. Eles são amplamente utilizados para fazer 
                  os sites funcionarem de forma mais eficiente e fornecer informações aos proprietários do site.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">2. Como Usamos Cookies</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  O SleepyPeepy utiliza cookies para diversos propósitos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Garantir o funcionamento adequado do site</li>
                  <li>Lembrar suas preferências e configurações</li>
                  <li>Melhorar a experiência do usuário</li>
                  <li>Analisar como você usa nosso site</li>
                  <li>Personalizar conteúdo e anúncios</li>
                </ul>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">3. Tipos de Cookies que Utilizamos</CardTitle>
                
                <div className="space-y-4">
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Cookies Essenciais</h4>
                    <p className="text-sm text-muted-foreground">
                      São necessários para o funcionamento básico do site. Sem eles, você não conseguirá 
                      usar recursos fundamentais do site.
                    </p>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Cookies de Desempenho</h4>
                    <p className="text-sm text-muted-foreground">
                      Coletam informações sobre como você usa o site, como quais páginas visita com mais 
                      frequência. Esses dados nos ajudam a melhorar o funcionamento do site.
                    </p>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Cookies de Funcionalidade</h4>
                    <p className="text-sm text-muted-foreground">
                      Permitem que o site lembre das escolhas que você faz (como seu nome de usuário ou 
                      preferências de idioma) e forneçam recursos aprimorados e personalizados.
                    </p>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Cookies de Marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      São usados para rastrear visitantes em sites. A intenção é exibir anúncios que sejam 
                      relevantes e atraentes para o usuário individual.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">4. Cookies de Terceiros</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Além de nossos próprios cookies, também utilizamos cookies de terceiros para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Google Analytics:</strong> Para analisar o tráfego e uso do site</li>
                  <li><strong>Redes Sociais:</strong> Para permitir compartilhamento de conteúdo</li>
                  <li><strong>Plataformas de Publicidade:</strong> Para exibir anúncios relevantes</li>
                </ul>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">5. Duração dos Cookies</CardTitle>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Cookies de Sessão</h4>
                    <p className="text-sm text-muted-foreground">
                      São temporários e são excluídos quando você fecha o navegador.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Cookies Persistentes</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanecem no seu dispositivo por um período específico ou até você excluí-los manualmente.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">6. Como Controlar e Excluir Cookies</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Você tem o direito de aceitar ou recusar cookies. A maioria dos navegadores aceita cookies 
                  automaticamente, mas você pode modificar as configurações do seu navegador para recusar 
                  cookies se preferir.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground mb-2">
                    <strong>Como gerenciar cookies nos principais navegadores:</strong>
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                    <li>• <strong>Firefox:</strong> Opções → Privacidade e segurança → Cookies</li>
                    <li>• <strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
                    <li>• <strong>Edge:</strong> Configurações → Privacidade → Cookies</li>
                  </ul>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Nota: Se você bloquear cookies, algumas funcionalidades do site podem não funcionar corretamente.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">7. Seu Consentimento</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Ao continuar usando nosso site após ler esta política, você consente com o uso de cookies 
                  conforme descrito. Você pode retirar seu consentimento a qualquer momento ajustando as 
                  configurações do seu navegador ou entrando em contato conosco.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">8. Atualizações desta Política</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em nossas 
                  práticas ou por razões operacionais, legais ou regulatórias. Recomendamos que você revise 
                  esta página regularmente.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">9. Mais Informações</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Para mais informações sobre nossa Política de Cookies ou como processamos seus dados, 
                  consulte nossa <a href="/privacidade" className="text-primary hover:underline">Política de Privacidade</a> ou 
                  entre em contato conosco em:{" "}
                  <a href="mailto:contato@sleepypeepy.site" className="text-primary hover:underline">
                    contato@sleepypeepy.site
                  </a>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cookies;
