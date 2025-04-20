
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SolicitarDivulgacao from "./pages/SolicitarDivulgacao";
import SolicitarArte from "./pages/SolicitarArte";
import SolicitarCobertura from "./pages/SolicitarCobertura";
import MinhasSolicitacoes from "./pages/MinhasSolicitacoes";
import VerSolicitacao from "./pages/VerSolicitacao";
import AvaliarSolicitacao from "./pages/AvaliarSolicitacao";
import AdminTriagem from "./pages/admin/Triagem";
import AdminVerSolicitacao from "./pages/admin/VerSolicitacao";
import AdminAvaliacoes from "./pages/admin/Avaliacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/solicitar/divulgacao" element={<ProtectedRoute><SolicitarDivulgacao /></ProtectedRoute>} />
            <Route path="/solicitar/arte" element={<ProtectedRoute><SolicitarArte /></ProtectedRoute>} />
            <Route path="/solicitar/cobertura" element={<ProtectedRoute><SolicitarCobertura /></ProtectedRoute>} />
            <Route path="/minhas-solicitacoes" element={<ProtectedRoute><MinhasSolicitacoes /></ProtectedRoute>} />
            <Route path="/solicitacao/:id" element={<ProtectedRoute><VerSolicitacao /></ProtectedRoute>} />
            <Route path="/avaliar/:id" element={<ProtectedRoute><AvaliarSolicitacao /></ProtectedRoute>} />
            <Route path="/admin/triagem" element={<ProtectedRoute adminOnly={true}><AdminTriagem /></ProtectedRoute>} />
            <Route path="/admin/solicitacao/:id" element={<ProtectedRoute adminOnly={true}><AdminVerSolicitacao /></ProtectedRoute>} />
            <Route path="/admin/avaliacoes" element={<ProtectedRoute adminOnly={true}><AdminAvaliacoes /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
