import { Header } from "@/components/Header";
import { Footer } from "@/components/PageChrome";
import { WorkoutGenerator } from "@/components/WorkoutGenerator";

export default function WorkoutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <WorkoutGenerator />
      </main>
      <Footer />
    </>
  );
}
