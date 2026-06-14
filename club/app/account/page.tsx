import { Header } from "@/components/Header";
import { Footer } from "@/components/PageChrome";
import { AccountPanel } from "@/components/AccountPanel";

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <AccountPanel />
      </main>
      <Footer />
    </>
  );
}
