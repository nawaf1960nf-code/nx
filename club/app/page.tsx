import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MuscleExplorer } from "@/components/MuscleExplorer";
import { FeatureGrid } from "@/components/FeatureGrid";
import { MapSectionHeading, Footer } from "@/components/PageChrome";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <section id="map" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
          <MapSectionHeading />
          <MuscleExplorer />
        </section>

        <FeatureGrid />
      </main>
      <Footer />
    </>
  );
}
