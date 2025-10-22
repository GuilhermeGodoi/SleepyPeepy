import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CookieConsent from "./components/CookieConsent";

import RequireAuth from "@/auth/RequireAuth";

// Páginas
import Index from "./pages/Index";
import Projeto7Dias from "./pages/Projeto7Dias";
import Projeto7DiasAnsiedade from "./pages/Projeto7DiasAnsiedade";
import Exercicios from "./pages/Exercicios";
import Receitas from "./pages/Receitas";
import Produtos from "./pages/Produtos";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import QuizInsonia from "./pages/QuizInsonia";
import QuizAnsiedade from "./pages/QuizAnsiedade";
import QuizMisto from "./pages/QuizMisto";
import Vendas from "./pages/Vendas"; // página de vendas (pública)
import Checkout from "./pages/Checkout"; // <-- NOVO: página de checkout (pública)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CookieConsent />
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/quiz-insonia" element={<QuizInsonia />} />
          <Route path="/quiz-ansiedade" element={<QuizAnsiedade />} />
          <Route path="/quiz-misto" element={<QuizMisto />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* Página de vendas e checkout (públicas) */}
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Aliases (caso tenha links antigos com maiúsculas) */}
          <Route path="/QuizInsonia" element={<Navigate to="/quiz-insonia" replace />} />
          <Route path="/QuizAnsiedade" element={<Navigate to="/quiz-ansiedade" replace />} />
          <Route path="/QuizMisto" element={<Navigate to="/quiz-misto" replace />} />
          <Route
            path="/Projeto7DiasAnsiedade"
            element={<Navigate to="/projeto-7-dias/ansiedade" replace />}
          />

          {/* --- ROTAS PRIVADAS (exigem login) --- */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Index />
              </RequireAuth>
            }
          />

          {/* Projeto 7 dias — sono (página já existente) */}
          <Route
            path="/projeto-7-dias"
            element={
              <RequireAuth>
                <Projeto7Dias />
              </RequireAuth>
            }
          />
          {/* Alias explícito /projeto-7-dias/sono apontando para a mesma página */}
          <Route
            path="/projeto-7-dias/sono"
            element={
              <RequireAuth>
                <Projeto7Dias />
              </RequireAuth>
            }
          />

          {/* Projeto 7 dias — ansiedade */}
          <Route
            path="/projeto-7-dias/ansiedade"
            element={
              <RequireAuth>
                <Projeto7DiasAnsiedade />
              </RequireAuth>
            }
          />

          <Route
            path="/exercicios"
            element={
              <RequireAuth>
                <Exercicios />
              </RequireAuth>
            }
          />
          <Route
            path="/receitas"
            element={
              <RequireAuth>
                <Receitas />
              </RequireAuth>
            }
          />
          <Route
            path="/produtos"
            element={
              <RequireAuth>
                <Produtos />
              </RequireAuth>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
