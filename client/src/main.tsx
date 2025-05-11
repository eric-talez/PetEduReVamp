import { createRoot } from "react-dom/client";
import SimpleApp from "./SimpleApp";
import { AuthProvider } from "./hooks/useAuth";
import "./index.css";
import { ThemeProvider } from "./context/theme-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIAnalysisProvider } from "./hooks/useAIAnalysis";
import './debug.js';

console.log('ENV VAR CHECK in main:', import.meta.env.VITE_KAKAO_MAPS_API_KEY);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <AIAnalysisProvider>
            <SimpleApp />
          </AIAnalysisProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
