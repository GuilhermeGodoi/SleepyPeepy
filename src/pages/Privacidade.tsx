import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 pb-12 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-lavender bg-clip-text text-transparent">
              Política de Privacidade
            </h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <Card className="bg-card border-border shadow-soft">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <section>
                <CardTitle className="text-xl mb-3">1. Introdução</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  A SleepyPeepy ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade. 
                  Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas 
                  informações pessoais quando você utiliza nosso site e serviços.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">2. Informações que Coletamos</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Informações de identificação pessoal (nome, endereço de e-mail)</li>
                  <li>Dados de navegação e uso do site</li>
                  <li>Informações de dispositivo e localização</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">3. Como Usamos suas Informações</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Utilizamos as informações coletadas para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Fornecer, operar e manter nossos serviços</li>
                  <li>Melhorar, personalizar e expandir nossos serviços</li>
                  <li>Comunicar com você sobre atualizações e ofertas</li>
                  <li>Processar transações e enviar informações relacionadas</li>
                  <li>Analisar como você usa nossos serviços</li>
                  <li>Prevenir fraudes e garantir segurança</li>
                </ul>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">4. Compartilhamento de Informações</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                  exceto nas seguintes circunstâncias: com seu consentimento explícito, para cumprir 
                  obrigações legais, ou para proteger nossos direitos e propriedade.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">5. Segurança dos Dados</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                  suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. 
                  No entanto, nenhum método de transmissão pela internet é 100% seguro.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">6. Seus Direitos</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                  <li>Revogar seu consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">7. Retenção de Dados</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Retemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos 
                  descritos nesta política, a menos que um período de retenção mais longo seja exigido ou 
                  permitido por lei.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">8. Cookies e Tecnologias Similares</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência. Para mais 
                  informações, consulte nossa <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a>.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">9. Alterações nesta Política</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                  quaisquer alterações publicando a nova política nesta página e atualizando a data de 
                  "última atualização".
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">10. Contato</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados 
                  pessoais, entre em contato conosco em:{" "}
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

export default Privacidade;
