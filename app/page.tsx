"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { Play, Sparkles, Users, Brain, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mesh">
      {/* الهيدر */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-5 text-ink-600 text-sm font-medium">
            <a href="#features" className="hover:text-primary-500 transition">
              المميزات
            </a>
            <a href="#how" className="hover:text-primary-500 transition">
              طريقة اللعب
            </a>
          </nav>
          <UserMenu />
        </div>
      </header>

      {/* الهيرو */}
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full font-bold text-xs mb-6 animate-float-up">
          <Sparkles className="w-3.5 h-3.5" />
          أسئلة جديدة بالذكاء الاصطناعي كل مرة
        </div>

        <div className="mb-5 animate-float-up">
          <Logo size="lg" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-5 animate-float-up">
          <span className="text-ink-800">لعبة الفرق</span>
          <span className="text-primary-500"> التنافسية الأذكى</span>
        </h1>

        <p
          className="text-base md:text-lg text-ink-500 max-w-xl mx-auto mb-8 leading-relaxed animate-float-up"
          style={{ animationDelay: "100ms" }}
        >
          اجمع أصحابك، اختار فريقك، وتنافس في تصنيفات متنوعة بأسئلة لا تتكرر —
          مع وسائل مساعدة ذكية تخلي الحماس على آخره.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-float-up"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/setup">
            <Button size="lg" icon={<Play className="w-4 h-4" />}>
              ابدأ اللعبة الآن
            </Button>
          </Link>
          <a href="#how">
            <Button size="lg" variant="secondary">
              شوف كيف تلعب
            </Button>
          </a>
        </div>
      </section>

      {/* المميزات */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2">
            ليش <span className="text-primary-500">نون عين؟</span>
          </h2>
          <p className="text-ink-500 text-sm">
            أكثر من مجرد لعبة سؤال وجواب
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Brain className="w-5 h-5" />}
            title="ذكاء اصطناعي"
            description="أسئلة جديدة كل مرة، وتحكيم دقيق للإجابات."
            color="bg-primary-50 text-primary-600"
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="١١ قدرة"
            description="الفخ، الحفرة، التحدي المزدوج، المضاعف، وأكثر."
            color="bg-yellow-50 text-yellow-700"
          />
          <FeatureCard
            icon={<Users className="w-5 h-5" />}
            title="٥٠+ تصنيف"
            description="أنمي، أفلام، رياضة، سيارات، وثقافة عامة."
            color="bg-blue-50 text-blue-600"
          />
        </div>
      </section>

      {/* كيف تلعب */}
      <section id="how" className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2">
            كيف <span className="text-primary-500">تلعب؟</span>
          </h2>
          <p className="text-ink-500 text-sm">
            أربع خطوات بسيطة وتبدأ المتعة
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Step
            num="١"
            title="جهّز الفرق"
            description="اسم كل فريق، لونه، وعدد لاعبيه. كل شي بثواني."
          />
          <Step
            num="٢"
            title="اختار التصنيفات"
            description="كل فريق يختار ٣ تصنيفات. هذي حلبتك."
          />
          <Step
            num="٣"
            title="اختار القدرات"
            description="٤ قدرات من ١١ - تكتيك يفرق بين الفوز والخسارة."
          />
          <Step
            num="٤"
            title="ابدأ التنافس"
            description="دقيقة لفريقك، ١٥ ثانية للثاني، والذكي يفوز."
          />
        </div>
      </section>

      {/* فوتر */}
      <footer className="border-t border-ink-100 mt-6">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <p className="text-ink-400 text-xs">
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
    <div className="bg-white border border-ink-100 rounded-2xl p-5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold mb-1">{title}</h3>
      <p className="text-ink-500 text-sm leading-relaxed">{description}</p>
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
    <div className="bg-white border border-ink-100 rounded-2xl p-4 flex gap-4">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-500 text-white text-lg font-black flex items-center justify-center">
        {num}
      </div>
      <div>
        <h3 className="text-base font-bold mb-0.5">{title}</h3>
        <p className="text-ink-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
