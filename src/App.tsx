import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SurahNaasPage from "./pages/SurahNaasPage";
import SurahFalaqPage from "./pages/SurahFalaqPage";
import SurahIkhlaasPage from "./pages/SurahIkhlaasPage";
import SurahMasadPage from "./pages/SurahMasadPage";
import SurahNasrPage from "./pages/SurahNasrPage";
import SurahKaafiruunPage from "./pages/SurahKaafiruunPage";
import SurahKawtharPage from "./pages/SurahKawtharPage";
import SurahMaunPage from "./pages/SurahMaunPage";
import SurahQurayshPage from "./pages/SurahQurayshPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/surah/114" element={<SurahNaasPage />} />
            <Route path="/surah/113" element={<SurahFalaqPage />} />
            <Route path="/surah/112" element={<SurahIkhlaasPage />} />
            <Route path="/surah/111" element={<SurahMasadPage />} />
            <Route path="/surah/110" element={<SurahNasrPage />} />
            <Route path="/surah/109" element={<SurahKaafiruunPage />} />
            <Route path="/surah/108" element={<SurahKawtharPage />} />
            <Route path="/surah/107" element={<SurahMaunPage />} />
            <Route path="/surah/106" element={<SurahQurayshPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
