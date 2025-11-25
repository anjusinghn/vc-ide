import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { TooltipProvider } from "./components/ui/tooltip";
import { MainLayout } from "./components/layout/MainLayout";
import { CommandPalette } from "./components/command-bar/CommandPalette";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { LayoutProvider } from "./contexts/LayoutContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import "./index.css";
import "./shell.css";

const queryClient = new QueryClient();

function AppContent() {
  useKeyboardShortcuts();

  return (
    <TooltipProvider>
      <MainLayout />
      <CommandPalette />
    </TooltipProvider>
  );
}

export default function App() {
  return (
    <div className="dark h-full">
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <WorkspaceProvider>
            <LayoutProvider>
              <AppContent />
            </LayoutProvider>
          </WorkspaceProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </div>
  );
}
