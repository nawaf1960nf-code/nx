import { Header } from "@/components/Header";
import { Footer } from "@/components/PageChrome";
import { ProgressDashboard } from "@/components/ProgressDashboard";

export default function ProgressPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ProgressDashboard />
      </main>
      <Footer />
    </>
  );
}
