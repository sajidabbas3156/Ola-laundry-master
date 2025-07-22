
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustIndicators } from "@/components/landing/TrustIndicators";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    console.log("LandingPage component mounted successfully");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main>
        <HeroSection />
        <TrustIndicators />
        <FeaturesGrid />
        <StatsSection />
        <PricingSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
