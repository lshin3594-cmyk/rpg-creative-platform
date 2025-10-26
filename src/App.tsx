
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { StarryBackground } from "./components/game/StarryBackground";
import Index from "./pages/Index";
import CreateGame from "./pages/CreateGame";
import CreateFanfic from "./pages/CreateFanfic";

import StoryView from "./pages/StoryView";
import Profile from "./pages/Profile";
import MySaves from "./pages/MySaves";
import GameSaves from "./pages/GameSaves";
import VkCallback from "./pages/VkCallback";
import NotFound from "./pages/NotFound";
import { GameScreen } from "./components/GameScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
        <StarryBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/play-game" element={<GameScreen />} />
            <Route path="/game-saves" element={<GameSaves />} />
            <Route path="/story/new" element={<GameScreen />} />
            <Route path="/create-fanfic" element={<CreateFanfic />} />

            <Route path="/story/:id" element={<StoryView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-saves" element={<MySaves />} />
            <Route path="/auth/vk/callback" element={<VkCallback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;