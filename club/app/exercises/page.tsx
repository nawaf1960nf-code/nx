import { Header } from "@/components/Header";
import { Footer } from "@/components/PageChrome";
import { ExerciseLibrary } from "@/components/ExerciseLibrary";

export default function ExercisesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ExerciseLibrary />
      </main>
      <Footer />
    </>
  );
}
