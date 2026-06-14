import { Header } from "@/components/Header";
import { Footer } from "@/components/PageChrome";
import { Consultant } from "@/components/Consultant";

export default function ConsultantPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Consultant />
      </main>
      <Footer />
    </>
  );
}
