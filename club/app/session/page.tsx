import { Header } from "@/components/Header";
import { Footer } from "@/components/PageChrome";
import { SessionPlayer } from "@/components/SessionPlayer";

export default function SessionPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <SessionPlayer />
      </main>
      <Footer />
    </>
  );
}
