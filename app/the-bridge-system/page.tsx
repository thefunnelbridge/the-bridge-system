import type { Metadata } from "next";
import {
  AudienceSection,
  BenefitsSection,
  BridgeFooter,
  ComparisonSection,
  DeliverablesSection,
  FinalCTA,
  FounderSection,
  HeroSection,
  HowItWorksSection,
  IndustriesSection,
  IntegrationsSection,
  ModulesSection,
  Navbar,
  ProblemSection,
  ProductSection,
  StrategicEngineSection,
  ThesisSection,
  VisionSection,
  WorkModelSection,
} from "@/components/landing/BridgeSystemSections";

export const metadata: Metadata = {
  title: "The Bridge System™ | Inteligencia aplicada para empresas",
  description:
    "Diagnostica puntos de fuga, prioriza acciones y visualiza el avance con The Bridge System™ by The Funnel Bridge™.",
};

export default function TheBridgeSystemPage() {
  return (
    <main className="min-h-screen bg-bone text-ink">
      <Navbar />
      <HeroSection />
      <ThesisSection />
      <ProblemSection />
      <ProductSection />
      <ComparisonSection />
      <HowItWorksSection />
      <ModulesSection />
      <DeliverablesSection />
      <StrategicEngineSection />
      <IntegrationsSection />
      <IndustriesSection />
      <AudienceSection />
      <BenefitsSection />
      <WorkModelSection />
      <FounderSection />
      <VisionSection />
      <FinalCTA />
      <BridgeFooter />
    </main>
  );
}
