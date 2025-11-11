// src/pages/Checkout.tsx //
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, CreditCard, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// === Stripe ===
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

/* ===== Helpers ===== */
function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}
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

/* ==== Planos (mantive seu conteúdo/valores) ==== */
const plans = {
  mensal: {
    name: "Mensal",
    desc: "Assinatura simples, cancele quando quiser",
    price: 47,
    label: "/mês",
  },
  semestral: {
    name: "Semestral",
    desc: "Economize 20% pagando 6 meses",
    price: 222,
    label: "por 6 meses",
  },
  anual: {
    name: "Anual",
    desc: "Pague 12 e economize 30%",
    price: 384,
    label: "por 12 meses",
  },
} as const;
type PlanKey = keyof typeof plans;

/* ===== Chama seu backend para criar/atualizar o PaymentIntent ===== */
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

/* ====== Form interno que faz o confirmPayment ====== */
function StripeForm({
  planId,
  formData,
  clientSecret,
  onProcessing,
}: {
  planId: PlanKey;
  clientSecret: string | null;
  formData: { name: string; email: string; cpf: string; cellphone: string; acceptTerms: boolean };
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

    // Confirma o pagamento com Stripe
    const { error } = await stripe!.confirmPayment({
      elements: elements!,
      confirmParams: {
        return_url: `${window.location.origin}/billing/sucesso`,
        payment_method_data: {
          billing_details: {
            name: formData.name || undefined,
            email: formData.email || undefined,
            phone: formData.cellphone ? `+55${onlyDigits(formData.cellphone)}` : undefined,
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

    /** ===== 🟢 Pixel Meta: evento de compra ===== */
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Purchase", {
        value: plans[planId].price,
        currency: "BRL",
        content_name: plans[planId].name,
        event_source: "stripe_checkout",
      });
    }

    // Redireciona para a página de sucesso
    navigate("/billing/sucesso", { replace: true });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* PaymentElement desenha os campos do Stripe (cartão, boleto/pix se ativo etc) */}
      {clientSecret ? (
        <PaymentElement />
      ) : (
        <div className="text-sm text-muted-foreground">Carregando formulário de pagamento…</div>
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

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialPlan = (searchParams.get("plano") as PlanKey) || "mensal";
  const [planId, setPlanId] = useState<PlanKey>(initialPlan);
  const plan = plans[planId];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    cellphone: "",
    acceptTerms: false,
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cria/atualiza PaymentIntent quando:
  // - muda o plano
  // - email mudou para algo "parecido" com válido (simples)
  // - nome mudou (opcional)
  useEffect(() => {
    const abort = new AbortController();

    const run = async () => {
      try {
        const cpfCnpj = onlyDigits(formData.cpf);
        const taxId = cpfCnpj.length >= 11 ? cpfCnpj : undefined;
        const rawPhone = onlyDigits(formData.cellphone);
        const phoneE164 = rawPhone.length >= 10 ? `+55${rawPhone}` : undefined;

        const orderId = crypto.randomUUID();

        const { clientSecret } = await createPaymentIntent({
          plan: planId,
          customer: {
            name: formData.name || undefined,
            email: formData.email || undefined,
            ...(taxId ? { taxId } : {}),
            ...(phoneE164 ? { cellphone: phoneE164 } : {}),
          },
          orderId,
        });
        if (!abort.signal.aborted) setClientSecret(clientSecret);
      } catch (err: any) {
        if (!abort.signal.aborted) {
          setClientSecret(null);
          toast({
            title: "Erro ao preparar pagamento",
            description: err?.message || "Tente novamente.",
            variant: "destructive",
          });
        }
      }
    };

    // Regra simples: só cria quando já temos pelo menos um email digitado (reduz intents “fantasmas”)
    if (formData.email && /\S+@\S+\.\S+/.test(formData.email)) {
      run();
    } else {
      setClientSecret(null);
    }

    return () => abort.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, formData.email]);

  // Aparência do Stripe alinhada ao seu tema

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
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
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
          {/* ===== Esquerda: Dados + PaymentElement ===== */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-primary/20">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                <h1 className="text-2xl font-bold md:text-3xl">Finalizar Assinatura</h1>
                <p className="mt-2 text-muted-foreground">
                  Você está a um passo de transformar suas noites 🌙
                </p>
              </div>

              <div className="space-y-6 p-6">
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

                {/* Pagamento */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Método de Pagamento</h2>

                  {/* Seletores visuais */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cartão */}
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("card-form");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-primary/50 bg-primary/5 transition-all hover:border-primary"
                      aria-label="Pagar com cartão"
                    >
                      <CreditCard className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium text-primary">Cartão de Crédito</span>
                    </button>

                    {/* Pix */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (isProcessing) return;
                        setIsProcessing(true);

                        try {
                          // Mostra carregando no botão
                          const originalText = "Pix";
                          const btn = document.activeElement as HTMLButtonElement | null;
                          if (btn) btn.innerHTML = `<svg class='animate-spin h-5 w-5 text-primary' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle><path class='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z'></path></svg>`;

                          const r = await fetch("/api/abacatepay/create-charge", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              plan: planId,
                              customer: {
                                name: formData.name,
                                email: formData.email,
                                cellphone: formData.cellphone,
                                cpf: onlyDigits(formData.cpf),
                              },
                            }),
                          });

                          const res = await r.json();
                          if (!r.ok) throw new Error(res.error || "Falha ao criar Pix.");

                          const modal = document.createElement("div");
                          modal.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
`;

                          modal.innerHTML = `
  <div style="
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    max-width: 400px;
    text-align: center;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  ">
    <h2 style="font-size:20px;font-weight:600;margin-bottom:16px;color:#222;">Escaneie o QR Code Pix</h2>
    ${res.qr_image
                              ? `<img src="${res.qr_image.startsWith('data:image') ? res.qr_image : 'data:image/png;base64,' + res.qr_image}"
          alt="QR Code Pix"
          style="width:240px;height:auto;margin-bottom:14px;border-radius:12px;">`
                              : ""
                            }
    ${res.qr_code
                              ? `<p style="font-size:13px;word-break:break-all;color:#555;margin-bottom:10px;">${res.qr_code}</p>`
                              : ""
                            }
    ${res.payment_url
                              ? `<p><a href="${res.payment_url}" target="_blank" style="color:#0089AC;text-decoration:none;font-weight:bold;">Clique aqui para pagar</a></p>`
                              : ""
                            }
    <button id="closePixModal" style="
      margin-top:20px;
      padding:10px 20px;
      border:none;
      background:#0089AC;
      color:white;
      border-radius:8px;
      font-weight:500;
      cursor:pointer;
      transition:background 0.2s ease;
    ">Fechar</button>
  </div>
  <style>
    @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
  </style>
`;

                          document.body.appendChild(modal);
                          modal.querySelector("#closePixModal")?.addEventListener("click", () => modal.remove());

                          // ✅ Verifica status de pagamento (até 90s)
                          const start = Date.now();
                          const checkPayment = async () => {
                            if (Date.now() - start > 90000) return;
                            const resp = await fetch(res.payment_url);
                            const text = await resp.text();
                            if (text.includes("Pago") || text.includes("Concluído")) {
                              modal.remove();
                              window.location.href = "/billing/sucesso";
                            } else {
                              setTimeout(checkPayment, 5000);
                            }
                          };
                          checkPayment();
                        } catch (err: any) {
                          alert(err.message || "Erro ao processar Pix.");
                        } finally {
                          setIsProcessing(false);
                          const btn = document.activeElement as HTMLButtonElement | null;
                          if (btn) btn.innerHTML = `
        <svg
          class="h-6 w-6 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3L3 8v8l9 5 9-5V8l-9-5zm6.5 13.5l-6.5 3.6-6.5-3.6v-5l6.5 3.6 6.5-3.6v5z" />
        </svg>
        <span class="text-sm font-medium">Pix</span>
      `;
                        }
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all"
                      aria-label="Pagar com Pix"
                    >
                      <svg
                        className="h-6 w-6 text-primary"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 3L3 8v8l9 5 9-5V8l-9-5zm6.5 13.5l-6.5 3.6-6.5-3.6v-5l6.5 3.6 6.5-3.6v5z" />
                      </svg>
                      <span className="text-sm font-medium">Pix</span>
                    </button>

                  </div>

                  {/* Stripe Elements (sem alterações) */}
                  <div id="card-form">
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
                          planId={planId}
                          formData={formData}
                          clientSecret={clientSecret}
                          onProcessing={setIsProcessing}
                        />
                      </Elements>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Preencha seu e-mail para carregar o pagamento.
                      </div>
                    )}
                  </div>
                </div>

                <Separator />


                {/* Termos */}
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

          {/* ===== Direita: Resumo + SELETOR DE PLANO (troca na hora) ===== */}
          <div className="space-y-4">
            <Card className="p-5 border-primary/20">
              <h2 className="text-lg font-semibold mb-3">Resumo do Pedido</h2>

              <div className="flex flex-col gap-3">
                {(Object.entries(plans) as [PlanKey, (typeof plans)["mensal"]][]).map(([id, p]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPlanId(id)}
                    className={`w-full text-left rounded-lg border-2 p-4 transition-all ${planId === id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{p.name}</span>
                      <span className="font-bold text-primary">R$ {p.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                    <p className="text-xs text-muted-foreground">{p.label}</p>
                    {planId === id && (
                      <div className="mt-2 flex items-center text-xs text-primary gap-1">
                        <Check className="w-3 h-3" /> Plano selecionado
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>R$ {plan.price}</span>
              </div>
            </Card>

            <Card className="p-4 text-sm text-muted-foreground bg-muted/30">
              <p>As cobranças são processadas pela Stripe em ambiente 100% seguro 🔒</p>
              <p className="mt-1">Você pode cancelar sua assinatura a qualquer momento.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
