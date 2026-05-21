import type { ReactNode } from "react";
import { BridgeAgentDock } from "./bridge-agent-dock";
import { LaunchGate } from "./launch-gate";
import { OnboardingOrchestrator } from "./onboarding-orchestrator";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink [background-image:linear-gradient(rgba(10,10,10,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(10,10,10,0.025)_1px,transparent_1px)] [background-size:36px_36px]">
      <LaunchGate />
      <Sidebar />
      <div className="md:pl-80">
        <Topbar />
        <main className="relative z-10 px-4 py-8 md:px-8 lg:px-10">{children}</main>
      </div>
      <OnboardingOrchestrator />
      <BridgeAgentDock />
    </div>
  );
}
