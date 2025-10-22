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
    return d.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
      [a && `(${a}`, a && ") ", b, b && (c ? "-" : ""), c].filter(Boolean).join("")
    );
  }
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

/* ==== Helper para criar sessão da Stripe ==== */
type StripeSessionPayload = {
  plan: "mensal" | "semestral" | "anual";
  customer: { name: string; email: string; taxId?: string; cellphone?: string };
  orderId?: string;
};
async function createStripeCheckoutSession(p: StripeSessionPayload) {
  const r = await fetch("/api/stripe/create-checkout-session", {
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
    throw new Error(detail || "Falha ao criar sessão Stripe");
  }
  return (await r.json()) as { url: string };
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
    cellphone: "",
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

      // Limpa CPF e telefone
      const cpfCnpj = onlyDigits(formData.cpf);
      const taxId =
        cpfCnpj.length === 11 || cpfCnpj.length === 14 ? cpfCnpj : undefined;

      const rawPhone = onlyDigits(formData.cellphone);
      const phoneE164 =
        rawPhone.length === 10 || rawPhone.length === 11 ? `+55${rawPhone}` : undefined;

      const orderId = crypto.randomUUID();

      if (paymentMethod === "pix") {
        const { checkoutUrl } = await createAbacateBilling({
          plan: planId,
          customer: {
            name: formData.name,
            email: formData.email,
            ...(taxId ? { taxId } : {}),
            ...(phoneE164 ? { cellphone: phoneE164 } : {}),
          },
          orderId,
        });
        window.location.href = checkoutUrl;
        return;
      }

      if (paymentMethod === "card") {
        const { url } = await createStripeCheckoutSession({
          plan: planId,
          customer: {
            name: formData.name,
            email: formData.email,
            ...(taxId ? { taxId } : {}),
            ...(phoneE164 ? { cellphone: phoneE164 } : {}),
          },
          orderId,
        });
        window.location.href = url;
        return;
      }
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
                      <div className="space-y-2">
                        <Label htmlFor="cellphone">Telefone (com DDD) *</Label>
                        <Input
                          id="cellphone"
                          inputMode="tel"
                          placeholder="(11) 98765-4321"
                          required
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
                </form>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            {/* ... (mesmo bloco do seu código original, sem alteração) ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
