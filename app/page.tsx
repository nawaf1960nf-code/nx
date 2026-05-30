import { Navbar } from "@/components/Navbar";
import { HeroPremium } from "@/components/landing/HeroPremium";
import { StatsSection } from "@/components/landing/StatsSection";
import { CourseCatalog } from "@/components/landing/CourseCatalog";
import { LevelsSection } from "@/components/landing/LevelsSection";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroPremium />
      <StatsSection />
      <CourseCatalog />
      <LevelsSection />
      <FeaturesBento />
      <DashboardPreviewSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
