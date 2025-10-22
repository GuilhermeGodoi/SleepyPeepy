import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, CreditCard, ArrowLeft, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ===== Helpers ===== */
function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

// Máscara BR simples para telefone: (11) 98765-4321 / (11) 8765-4321
function formatBRPhone(digits: string) {
  const d = digits.slice(0, 11);
  if (d.length <= 10) {
    // (AA) NNNN-NNNN
    return d.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
      [a && `(${a}`, a && ") ", b, b && (c ? "-" : ""), c].filter(Boolean).join("")
    );
  }
  // 11 dígitos: (AA) NNNNN-NNNN
  return d.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, (_, a, b, c) =>
    [a && `(${a}`, a && ") ", b, b && (c ? "-" : ""), c].filter(Boolean).join("")
  );
}

/* ==== Helper para criar cobrança na sua API do backend ==== */
type AbacateBillingPayload = {
  plan: "mensal" | "semestral" | "anual";
  customer: { name: string; email: string; taxId?: string; cellphone?: string };
  orderId?: string;
};
async function createAbacateBilling(p: AbacateBillingPayload) {
  const r = await fetch("/api/abacatepay/create-billing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!r.ok) {
    let detail = "";
    try {
      const j = await r.json();
      detail = j?.error || JSON.stringify(j);
    } catch {}
    throw new Error(detail || "Falha ao criar cobrança");
  }
  return (await r.json()) as { checkoutUrl: string; billingId?: string };
}

/* ==== Planos ==== */
const plans = {
  mensal: {
    name: "Plano Mensal",
    price: 47,
    originalPrice: null as number | null,
    period: "/mês",
    discount: 0,
    bonuses: [] as string[],
    monthlyPrice: undefined as number | undefined,
    installments: [
      { times: 1, value: 47 },
      { times: 2, value: 24.5 },
      { times: 3, value: 16.33 },
    ],
  },
  semestral: {
    name: "Plano Semestral",
    price: 222,
    originalPrice: 282,
    period: "por 6 meses",
    monthlyPrice: 37,
    discount: 20,
    bonuses: ["Guia 'Sono em 7 dias' grátis"],
    installments: [
      { times: 1, value: 222 },
      { times: 2, value: 111 },
      { times: 3, value: 74 },
      { times: 6, value: 37 },
    ],
  },
  anual: {
    name: "Plano Anual",
    price: 384,
    originalPrice: 564,
    period: "por 12 meses",
    monthlyPrice: 32,
    discount: 30,
    bonuses: ["Guia 'Sono em 7 dias' grátis", "2 bônus exclusivos", "Sessão de consultoria"],
    installments: [
      { times: 1, value: 384 },
      { times: 2, value: 192 },
      { times: 3, value: 128 },
      { times: 6, value: 64 },
      { times: 12, value: 32 },
    ],
  },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const planId = (searchParams.get("plano") as "mensal" | "semestral" | "anual") || "mensal";
  const plan = plans[planId] || plans.mensal;

  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("card");
  const [selectedInstallments, setSelectedInstallments] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    cellphone: "",       // 👈 NOVO
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    acceptTerms: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast({
        title: "Atenção",
        description: "Você precisa aceitar os termos para continuar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      if (paymentMethod === "pix") {
        // Limpa e valida CPF/CNPJ
        const cpfCnpj = onlyDigits(formData.cpf);
        const taxId =
          cpfCnpj.length === 11 || cpfCnpj.length === 14 ? cpfCnpj : undefined;

        // Limpa, formata para E.164 e valida telefone
        const rawPhone = onlyDigits(formData.cellphone);
        const phoneE164 =
          rawPhone.length === 10 || rawPhone.length === 11 ? `+55${rawPhone}` : undefined;

        // Integração AbacatePay (redireciona para o checkout hospedado)
        const { checkoutUrl } = await createAbacateBilling({
          plan: planId,
          customer: {
            name: formData.name,
            email: formData.email,
            ...(taxId ? { taxId } : {}),
            ...(phoneE164 ? { cellphone: phoneE164 } : {}),
          },
          orderId: crypto.randomUUID(), // opcional
        });
        window.location.href = checkoutUrl;
        return; // interrompe o fluxo local — usuário será redirecionado
      }

      // Cartão (Stripe) — vamos plugar na próxima etapa
      toast({
        title: "Cartão de crédito",
        description: "Na próxima etapa conectaremos a Stripe para cartão 👌",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao iniciar pagamento",
        description: err?.message || "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/vendas")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Checkout Seguro</span>
          </div>
        </div>
      </header>

      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Trust Badges */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>Conexão Segura SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Dados Criptografados</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Pagamento Protegido</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-primary/20">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                  <h1 className="text-2xl font-bold md:text-3xl">Finalizar Assinatura</h1>
                  <p className="mt-2 text-muted-foreground">Você está a um passo de transformar suas noites 🌙</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="João Silva"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          required
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                        />
                      </div>
                      {/* Telefone */}
                      <div className="space-y-2">
                        <Label htmlFor="cellphone">
                          Telefone (com DDD) {paymentMethod === "pix" ? "*" : ""}
                        </Label>
                        <Input
                          id="cellphone"
                          inputMode="tel"
                          placeholder="(11) 98765-4321"
                          required={paymentMethod === "pix"}
                          value={formData.cellphone}
                          onChange={(e) => {
                            const digits = onlyDigits(e.target.value);
                            setFormData({ ...formData, cellphone: formatBRPhone(digits) });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Método de Pagamento */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Método de Pagamento</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <CreditCard
                          className={`h-6 w-6 ${
                            paymentMethod === "card" ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">Cartão de Crédito</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === "pix"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <svg
                          className={`h-6 w-6 ${
                            paymentMethod === "pix" ? "text-primary" : "text-muted-foreground"
                          }`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 3L3 8v8l9 5 9-5V8l-9-5zm6.5 13.5l-6.5 3.6-6.5-3.6v-5l6.5 3.6 6.5-3.6v5z" />
                        </svg>
                        <span className="text-sm font-medium">PIX</span>
                      </button>
                    </div>
                  </div>

                  <Separator />

                  {/* Dados do Cartão (condicional) */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Dados do Cartão</h2>
                      </div>

                      {/* Parcelamento */}
                      <div className="space-y-2">
                        <Label htmlFor="installments">Parcelamento *</Label>
                        <select
                          id="installments"
                          value={selectedInstallments}
                          onChange={(e) => setSelectedInstallments(Number(e.target.value))}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {plan.installments.map((inst) => (
                            <option key={inst.times} value={inst.times}>
                              {inst.times}x de R$ {inst.value.toFixed(2).replace(".", ",")}
                              {inst.times === 1 ? " à vista" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número do Cartão *</Label>
                        <Input
                          id="cardNumber"
                          required={paymentMethod === "card"}
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nome no Cartão *</Label>
                        <Input
                          id="cardName"
                          required={paymentMethod === "card"}
                          value={formData.cardName}
                          onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                          placeholder="JOÃO SILVA"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Validade *</Label>
                          <Input
                            id="expiryDate"
                            required={paymentMethod === "card"}
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            placeholder="MM/AA"
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            required={paymentMethod === "card"}
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informações PIX (condicional) */}
                  {paymentMethod === "pix" && (
                    <div className="space-y-4">
                      <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L3 8v8l9 5 9-5V8l-9-5zm6.5 13.5l-6.5 3.6-6.5-3.6v-5l6.5 3.6 6.5-3.6v5z" />
                          </svg>
                          Pagamento via PIX
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Após confirmar o pedido, você será redirecionado ao PIX com QR Code e “copia e cola”.
                          O acesso é liberado automaticamente após a confirmação.
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Termos */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      Aceito os{" "}
                      <a href="/termos" className="text-primary hover:underline">
                        Termos de Uso
                      </a>{" "}
                      e a{" "}
                      <a href="/privacidade" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>
                      . Estou ciente que poderei cancelar a qualquer momento.
                    </label>
                  </div>

                  {/* Botão de Submissão */}
                  <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Finalizar Assinatura
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">Seus dados estão seguros e protegidos</p>
                </form>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="overflow-hidden border-primary/20">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                    <h2 className="text-xl font-bold">Resumo do Pedido</h2>
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{plan.name}</p>
                          {plan.monthlyPrice && <p className="text-sm text-muted-foreground">R$ {plan.monthlyPrice}/mês</p>}
                        </div>
                        {plan.discount > 0 && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            -{plan.discount}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      {typeof plan.originalPrice === "number" && plan.originalPrice > plan.price && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Preço original:</span>
                          <span className="line-through">R$ {plan.originalPrice}</span>
                        </div>
                      )}
                      {plan.discount > 0 && typeof plan.originalPrice === "number" && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>Desconto:</span>
                          <span>-R$ {plan.originalPrice - plan.price}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">R$ {plan.price}</span>
                    </div>
                    {paymentMethod === "card" && selectedInstallments > 1 && (
                      <p className="text-center text-sm text-muted-foreground">
                        {selectedInstallments}x de R$ {(plan.price / selectedInstallments).toFixed(2).replace(".", ",")}
                      </p>
                    )}
                    {paymentMethod === "pix" && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground line-through">R$ {plan.price}</p>
                        <p className="text-lg font-semibold text-primary">
                          R$ {(plan.price * 0.95).toFixed(2).replace(".", ",")} no PIX
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Economia de R$ {(plan.price * 0.05).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    )}
                    <p className="text-center text-sm text-muted-foreground">{plan.period}</p>

                    {plan.bonuses.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span>Bônus Inclusos:</span>
                          </div>
                          {plan.bonuses.map((bonus, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span className="text-muted-foreground">{bonus}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Garantia */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">Garantia de Satisfação</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cancele quando quiser, sem multas ou taxas extras. Simples e direto.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* O que você ganha */}
                <Card className="border-primary/20 p-6">
                  <h3 className="mb-4 font-semibold">O que você ganha:</h3>
                  <div className="space-y-3">
                    {[
                      "Acesso completo à plataforma",
                      "Módulo de sono profundo",
                      "Exercícios de respiração guiados",
                      "Receitas relaxantes",
                      "Áudios calmantes exclusivos",
                      "Suporte da comunidade",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
