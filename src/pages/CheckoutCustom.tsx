import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, CreditCard } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

function CheckoutForm({ plan }: { plan: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "https://sleepypeepy.site/checkout/sucesso" },
    });
    if (error) alert(error.message);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Processando..." : "Finalizar pagamento"}
      </Button>
    </form>
  );
}

export default function CheckoutCustom() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [plan, setPlan] = useState<"mensal" | "semestral" | "anual">("mensal");

  useEffect(() => {
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
      .then((r) => r.json())
      .then((d) => setClientSecret(d.clientSecret));
  }, [plan]);

  const appearance = {
    theme: "flat",
    variables: {
      colorPrimary: "#7B6EF6",
      colorBackground: "#ffffff",
      colorText: "#1A1A1A",
      borderRadius: "12px",
    },
  };

  const options = { clientSecret, appearance };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Lado esquerdo */}
        <Card className="p-6 border-primary/20">
          <h1 className="text-2xl font-bold">Pagamento SleepyPeepy</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Finalize sua assinatura com total segurança 💜
          </p>

          {/* Seletor de plano */}
          <div className="space-y-2 mb-6">
            <h2 className="text-lg font-semibold">Escolha o plano</h2>
            {[
              { id: "mensal", name: "Mensal", price: 47 },
              { id: "semestral", name: "Semestral", price: 222 },
              { id: "anual", name: "Anual", price: 384 },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id as any)}
                className={`w-full text-left border-2 rounded-lg p-4 transition-all ${
                  plan === p.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{p.name}</span>
                  <span className="font-bold text-primary">R$ {p.price}</span>
                </div>
              </button>
            ))}
          </div>

          <Separator className="my-4" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" /> Pagamento 100% seguro via Stripe
          </div>
        </Card>

        {/* Lado direito */}
        <Card className="p-6 border-primary/20">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm plan={plan} />
            </Elements>
          ) : (
            <p className="text-muted-foreground text-center">Carregando...</p>
          )}
        </Card>
      </div>
    </div>
  );
}
