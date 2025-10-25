
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
import Library from "./pages/Library";
import StoryView from "./pages/StoryView";
import Profile from "./pages/Profile";
import MySaves from "./pages/MySaves";
import VkCallback from "./pages/VkCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <StarryBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/create-fanfic" element={<CreateFanfic />} />
            <Route path="/library" element={<Library />} />
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