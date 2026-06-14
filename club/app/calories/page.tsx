import { Header } from "@/components/Header";
import { Footer } from "@/components/PageChrome";
import { CaloriePlanner } from "@/components/CaloriePlanner";

export default function CaloriesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <CaloriePlanner />
      </main>
      <Footer />
    </>
  );
}
