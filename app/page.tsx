"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Play, Sparkles, Users, Brain } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mesh">
      {/* الهيدر */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <nav className="hidden md:flex items-center gap-6 text-ink-600 font-medium">
          <a href="#features" className="hover:text-primary-500 transition">
            المميزات
          </a>
          <a href="#how" className="hover:text-primary-500 transition">
            طريقة اللعب
          </a>
          <a href="#categories" className="hover:text-primary-500 transition">
            التصنيفات
          </a>
        </nav>
      </header>

      {/* الهيرو */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-bold text-sm mb-8 animate-float-up">
          <Sparkles className="w-4 h-4" />
          أسئلة جديدة بالذكاء الاصطناعي كل مرة
        </div>

        <div className="mb-6 animate-float-up">
          <Logo size="xl" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 animate-float-up">
          <span className="text-ink-800">لعبة الفرق</span>
          <br />
          <span className="text-primary-500">التنافسية الأذكى</span>
        </h1>

        <p
          className="text-lg md:text-2xl text-ink-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-float-up"
          style={{ animationDelay: "100ms" }}
        >
          اجمع أصحابك، اختار فريقك، وتنافس في تصنيفات متنوعة بأسئلة لا تتكرر —
          مع وسائل مساعدة ذكية تخلي الحماس على آخره.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-float-up"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/setup">
            <Button size="xl" icon={<Play className="w-5 h-5" />}>
              ابدأ اللعبة الآن
            </Button>
          </Link>
          <a href="#how">
            <Button size="xl" variant="secondary">
              شوف كيف تلعب
            </Button>
          </a>
        </div>
      </section>

      {/* المميزات */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center mb-3">
          ليش <span className="text-primary-500">نون عين؟</span>
        </h2>
        <p className="text-center text-ink-500 text-lg mb-14">
          أكثر من مجرد لعبة سؤال وجواب
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="w-7 h-7" />}
            title="ذكاء اصطناعي ذكي"
            description="يولّد أسئلة جديدة كل مرة، ويحكم الإجابات بدقة وعدالة."
            color="bg-primary-50 text-primary-600"
          />
          <FeatureCard
            icon={<Sparkles className="w-7 h-7" />}
            title="١١ وسيلة مساعدة"
            description="من الفخ والحفرة إلى التحدي المزدوج والمضاعف. تكتيك كامل."
            color="bg-yellow-50 text-yellow-700"
          />
          <FeatureCard
            icon={<Users className="w-7 h-7" />}
            title="٥٠+ تصنيف"
            description="من الأنمي والأفلام إلى الرياضة والسيارات والثقافة العامة."
            color="bg-blue-50 text-blue-600"
          />
        </div>
      </section>

      {/* كيف تلعب */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center mb-3">
          كيف <span className="text-primary-500">تلعب؟</span>
        </h2>
        <p className="text-center text-ink-500 text-lg mb-14">
          أربع خطوات بسيطة وتبدأ المتعة
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Step
            num="١"
            title="جهّز الفرق"
            description="اختار اسم كل فريق، لونه، وعدد لاعبيه. كل شي بثواني."
          />
          <Step
            num="٢"
            title="اختار التصنيفات"
            description="كل فريق يختار ٣ تصنيفات من قائمة موسّعة. هذي حلبتك."
          />
          <Step
            num="٣"
            title="اختار وسائل المساعدة"
            description="٤ هوكات من ١١ — تكتيك يفرق بين الفوز والخسارة."
          />
          <Step
            num="٤"
            title="ابدأ التنافس"
            description="دقيقة لفريقك، ١٥ ثانية للثاني، والذكي يفوز."
          />
        </div>
      </section>

      {/* فوتر */}
      <footer className="border-t border-ink-100 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-ink-400 text-sm">
            © {new Date().getFullYear()} نون عين. كل الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white border-2 border-ink-100 rounded-3xl p-6 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-ink-500 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  num,
  title,
  description,
}: {
  num: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border-2 border-ink-100 rounded-3xl p-6 flex gap-5">
      <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary-500 text-white text-2xl font-black flex items-center justify-center">
        {num}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-ink-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
