
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useState } from "react";
import { GettingStartedGuide } from "@/components/help/GettingStartedGuide";
import { VideoTutorials } from "@/components/help/VideoTutorials";
import { ContactSupport } from "@/components/help/ContactSupport";
import { HelpCenterHero } from "@/components/help/HelpCenterHero";
import { QuickLinksSection } from "@/components/help/QuickLinksSection";
import { CategoriesSection } from "@/components/help/CategoriesSection";
import { TutorialsSection } from "@/components/help/TutorialsSection";
import { FAQSection } from "@/components/help/FAQSection";
import { ContactSupportSection } from "@/components/help/ContactSupportSection";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleBackToMain = () => {
    setActiveSection(null);
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  // Render specific sections based on activeSection
  if (activeSection === "getting-started") {
    return <GettingStartedGuide onBack={handleBackToMain} />;
  }

  if (activeSection === "video-tutorials") {
    return <VideoTutorials onBack={handleBackToMain} />;
  }

  if (activeSection === "contact-support") {
    return <ContactSupport onBack={handleBackToMain} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        <HelpCenterHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <QuickLinksSection onNavigate={handleNavigate} />
        <CategoriesSection onNavigate={handleNavigate} />
        <TutorialsSection onNavigate={handleNavigate} />
        <FAQSection />
        <ContactSupportSection onNavigate={handleNavigate} />
      </main>
      <Footer />
    </div>
  );
}
