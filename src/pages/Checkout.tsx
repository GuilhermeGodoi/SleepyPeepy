// src/pages/Checkout.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// === Stripe ===
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

/* ===== Helpers ===== */
function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}
function formatBRPhone(digits: string) {
  const d = digits.slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
      [a && `(${a}`, a && ") ", b, b && (c ? "-" : ""), c]
        .filter(Boolean)
        .join("")
    );
  }
  return d.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, (_, a, b, c) =>
    [a && `(${a}`, a && ") ", b, b && (c ? "-" : ""), c]
      .filter(Boolean)
      .join("")
  );
}

/* ==== Planos ==== */
const plans = {
  mensal: {
    name: "Mensal",
    desc: "Assinatura simples, cancele quando quiser",
    price: 47,
    oldPrice: 147,
    label: "/mês",
  },
  semestral: {
    name: "Semestral ⭐ Mais Popular",
    desc: "Economize 20% pagando 6 meses",
    price: 222,
    oldPrice: 282,
    label: "por 6 meses",
  },
  anual: {
    name: "Anual",
    desc: "Pague 12 e economize 30%",
    price: 384,
    oldPrice: 564,
    label: "por 12 meses",
  },
} as const;
type PlanKey = keyof typeof plans;

/* ===== API create-payment-intent ===== */
async function createPaymentIntent(payload: {
  plan: PlanKey;
  customer: { name?: string; email?: string; taxId?: string; cellphone?: string };
  orderId?: string;
}) {
  const r = await fetch("/api/stripe/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || "Falha ao criar PaymentIntent");
  }
  return (await r.json()) as { clientSecret: string };
}

/* ===== Stripe Form ===== */
function StripeForm({
  clientSecret,
  formData,
  onProcessing,
}: {
  clientSecret: string | null;
  formData: {
    name: string;
    email: string;
    cpf: string;
    cellphone: string;
    acceptTerms: boolean;
  };
  onProcessing: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();

  const canSubmit = !!clientSecret && !!stripe && !!elements;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast({
        title: "Atenção",
        description: "Você precisa aceitar os termos para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!canSubmit) return;

    onProcessing(true);

    const { error } = await stripe!.confirmPayment({
      elements: elements!,
      confirmParams: {
        return_url: `${window.location.origin}/billing/sucesso`,
        payment_method_data: {
          billing_details: {
            name: formData.name || undefined,
            email: formData.email || undefined,
            phone: formData.cellphone
              ? `+55${onlyDigits(formData.cellphone)}`
              : undefined,
          },
        },
      },
    });

    onProcessing(false);

    if (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    navigate("/billing/sucesso", { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {clientSecret ? (
        <PaymentElement />
      ) : (
        <div className="text-sm text-muted-foreground">
          Carregando formulário de pagamento…
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full text-base font-semibold"
        disabled={!canSubmit}
      >
        <Lock className="mr-2 h-5 w-5" />
        Finalizar Assinatura
      </Button>
    </form>
  );
}

/* ===== Página Checkout ===== */
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialPlan = (searchParams.get("plano") as PlanKey) || "mensal";
  const [planId, setPlanId] = useState<PlanKey>(initialPlan);
  const plan = plans[planId];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    cellphone: "",
    acceptTerms: false,
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /* ==== Cria PaymentIntent ao carregar ==== */
  useEffect(() => {
    const run = async () => {
      try {
        const orderId = crypto.randomUUID();
        const { clientSecret } = await createPaymentIntent({
          plan: planId,
          customer: {},
          orderId,
        });
        setClientSecret(clientSecret);
      } catch (err: any) {
        setClientSecret(null);
        toast({
          title: "Erro ao preparar pagamento",
          description: err?.message || "Tente novamente.",
          variant: "destructive",
        });
      }
    };
    run();
  }, [planId]);

  /* ==== Render ==== */
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vendas")}
            className="gap-2"
          >
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
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-primary/20">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
              <h1 className="text-2xl font-bold md:text-3xl">Finalizar Assinatura</h1>
              <p className="mt-2 text-muted-foreground">
                Você está a um passo de transformar sua ansiedade e noites de sono 🌙
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* ==== Dados Pessoais ==== */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="João Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      required
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
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
                        setFormData({
                          ...formData,
                          cellphone: formatBRPhone(digits),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* ==== Resumo do Pedido (Dropdown estilizado) ==== */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Resumo do Pedido</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="w-full flex justify-between items-center rounded-lg border border-border/50 bg-card/70 px-4 py-3 text-sm md:text-base font-medium hover:border-primary/50 hover:shadow-glow transition-all"
                  >
                    <span className="text-left">
                      <span className="block font-semibold text-primary">{plan.name}</span>
                      <span className="text-xs text-muted-foreground">{plan.desc}</span>
                      <span className="block mt-1 text-sm">
                        <span className="line-through text-muted-foreground mr-1">
                          R$ {plan.oldPrice}
                        </span>
                        <span className="font-bold text-primary">R$ {plan.price}</span>{" "}
                        <span className="text-xs text-muted-foreground">{plan.label}</span>
                      </span>
                    </span>
                    <svg
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-20 mt-2 w-full rounded-lg border border-border/40 bg-background shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1">
                      {(Object.entries(plans) as [PlanKey, (typeof plans)["mensal"]][])
                        .filter(([id]) => id !== planId)
                        .map(([id, p]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              setPlanId(id);
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm md:text-base hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{p.name}</span>
                              <span className="font-bold text-primary">R$ {p.price}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{p.desc}</p>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* ==== Pagamento ==== */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Pagamento</h2>
                <div className="flex items-center gap-3 border-2 border-primary/50 rounded-lg p-3 bg-primary/5">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">Cartão (via Stripe)</span>
                </div>

                {clientSecret ? (
                  <Elements
                    key={clientSecret}
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#0089AC",
                          colorBackground: "#FFFFFF",
                          colorText: "#000000",
                          colorDanger: "#E11D48",
                          fontFamily: "Inter, system-ui, sans-serif",
                          borderRadius: "12px",
                        },
                      },
                    }}
                  >
                    <StripeForm
                      clientSecret={clientSecret}
                      formData={formData}
                      onProcessing={setIsProcessing}
                    />
                  </Elements>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Carregando pagamento...
                  </div>
                )}
              </div>

              <Separator />

              {/* ==== Termos ==== */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptTerms: e.target.checked })
                  }
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
