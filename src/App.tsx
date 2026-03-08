import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import PlayPage from "./pages/PlayPage";
import MatchPage from "./pages/MatchPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route
                  path="/problems"
                  element={
                    <ProtectedRoute>
                      <ProblemsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/problems/:id"
                  element={
                    <ProtectedRoute>
                      <ProblemPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/play"
                  element={
                    <ProtectedRoute>
                      <PlayPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/match/:id"
                  element={
                    <ProtectedRoute>
                      <MatchPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
