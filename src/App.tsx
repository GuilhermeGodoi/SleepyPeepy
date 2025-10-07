import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CookieConsent from "./components/CookieConsent";

// Guard de autenticação (crie em src/auth/RequireAuth.tsx)
import RequireAuth from "@/auth/RequireAuth";

// Páginas
import Index from "./pages/Index";
import Projeto7Dias from "./pages/Projeto7Dias";
import Exercicios from "./pages/Exercicios";
import Receitas from "./pages/Receitas";
import Produtos from "./pages/Produtos";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import QuizInsonia from "./pages/QuizInsonia";

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
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/cookies" element={<Cookies />} />
          {/* Ex.: se tiver uma landing pública depois, adicione aqui: */}
          {/* <Route path="/lp" element={<LandingPublica />} /> */}

          {/* --- ROTAS PRIVADAS (protegidAS por login) --- */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Index />
              </RequireAuth>
            }
          />
          <Route
            path="/projeto-7-dias"
            element={
              <RequireAuth>
                <Projeto7Dias />
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
          
          {/* <Route path="/receitas" element={<RequireAuth><Receitas/></RequireAuth>} /> */}
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

