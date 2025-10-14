import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Termos = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 pb-12 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-lavender bg-clip-text text-transparent">
              Termos de Uso
            </h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <Card className="bg-card border-border shadow-soft">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <section>
                <CardTitle className="text-xl mb-3">1. Aceitação dos Termos</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar e usar o site SleepyPeepy, você concorda em cumprir e estar vinculado a estes 
                  Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve usar nosso site.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">2. Descrição do Serviço</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  O SleepyPeepy fornece informações, recursos e produtos relacionados à melhoria da qualidade 
                  do sono e bem-estar. Nossos serviços incluem programas educacionais, exercícios de relaxamento, 
                  receitas e recomendações de produtos naturais.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">3. Aviso Médico Importante</CardTitle>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-3">
                  <p className="text-foreground font-semibold mb-2">⚠️ Atenção</p>
                  <p className="text-muted-foreground leading-relaxed">
                    As informações fornecidas no SleepyPeepy são apenas para fins educacionais e informativos. 
                    Elas NÃO substituem aconselhamento, diagnóstico ou tratamento médico profissional. 
                    Sempre consulte um médico ou profissional de saúde qualificado antes de iniciar qualquer 
                    programa, tratamento ou suplementação.
                  </p>
                </div>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">4. Uso Adequado</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Você concorda em usar nosso site apenas para fins legais e de acordo com estes Termos. 
                  Você NÃO deve:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Usar o site de qualquer forma que viole leis locais, nacionais ou internacionais</li>
                  <li>Tentar obter acesso não autorizado ao site ou sistemas relacionados</li>
                  <li>Transmitir material malicioso, vírus ou código prejudicial</li>
                  <li>Reproduzir, duplicar ou copiar conteúdo sem permissão expressa</li>
                  <li>Usar o site para fins comerciais sem nossa autorização</li>
                </ul>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">5. Propriedade Intelectual</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Todo o conteúdo do site, incluindo textos, gráficos, logotipos, imagens e software, é 
                  propriedade da SleepyPeepy ou de seus licenciadores e está protegido por leis de direitos 
                  autorais e propriedade intelectual. Você não pode usar, reproduzir ou distribuir qualquer 
                  conteúdo sem permissão expressa por escrito.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">6. Produtos e Compras</CardTitle>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Ao adquirir produtos através do nosso site:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Você garante que tem capacidade legal para realizar transações</li>
                  <li>As informações fornecidas são verdadeiras e precisas</li>
                  <li>Os preços e disponibilidade estão sujeitos a alterações sem aviso prévio</li>
                  <li>Reservamos o direito de recusar ou cancelar pedidos</li>
                  <li>As políticas de reembolso e devolução estão sujeitas a termos específicos</li>
                </ul>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">7. Responsabilidades e Garantias</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Embora nos esforcemos para fornecer informações precisas e atualizadas, o conteúdo é 
                  fornecido "como está" sem garantias de qualquer tipo. Não garantimos que o site estará 
                  sempre disponível, livre de erros ou vírus. Você usa o site por sua própria conta e risco.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">8. Limitação de Responsabilidade</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Na extensão máxima permitida por lei, a SleepyPeepy não será responsável por quaisquer 
                  danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do uso 
                  ou incapacidade de usar nosso site ou produtos, mesmo que tenhamos sido avisados da 
                  possibilidade de tais danos.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">9. Links para Sites de Terceiros</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Nosso site pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, 
                  políticas de privacidade ou práticas desses sites. Recomendamos que você leia os termos e 
                  políticas de qualquer site de terceiros que visitar.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">10. Modificações dos Termos</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Reservamos o direito de modificar estes Termos de Uso a qualquer momento. As alterações 
                  entrarão em vigor imediatamente após a publicação no site. Seu uso contínuo do site após 
                  as alterações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">11. Lei Aplicável</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Estes Termos de Uso são regidos pelas leis do Brasil. Qualquer disputa relacionada a 
                  estes termos será resolvida nos tribunais competentes do Brasil.
                </p>
              </section>

              <section>
                <CardTitle className="text-xl mb-3">12. Contato</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre estes Termos de Uso, entre em contato conosco em:{" "}
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

export default Termos;
