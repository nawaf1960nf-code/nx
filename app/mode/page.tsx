"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useGameStore } from "@/lib/store";
import { ArrowLeft, Users, Crown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModePage() {
  const router = useRouter();
  const setPhase = useGameStore((s) => s.setPhase);

  const handlePickTeams = () => {
    setPhase("setup");
    router.push("/setup");
  };

  return (
    <main className="min-h-screen bg-mesh">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <UserMenu />
          <Link href="/">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              رجوع
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            اختار <span className="text-primary-500">وضع اللعب</span>
          </h1>
          <p className="text-ink-500 text-sm">
            وضع مختلف لكل تجمّع
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ModeCard
            icon={<Users className="w-7 h-7" />}
            title="لعبة الجمعة"
            subtitle="فريقين × ٣ تصنيفات"
            description="تجمع كلاسيكي. تقسموا فرقاً وتتنافسوا على ٦ فئات بـ ٣٦ سؤال."
            playerCount="٢ فريق"
            badge="الكلاسيكية"
            badgeColor="bg-primary-100 text-primary-700"
            gradient="from-primary-500 to-emerald-600"
            onClick={handlePickTeams}
          />

          <ModeCard
            icon={<Crown className="w-7 h-7" />}
            title="الديوانية"
            subtitle="٢ إلى ٦ لاعبين فردي"
            description="كل لاعب لحاله، كل واحد يختار تصنيفه. لو ما عرف، الباقي يسرقون نقاطه!"
            playerCount="٢-٦ لاعبين"
            badge="قريباً"
            badgeColor="bg-gold-500/15 text-gold-700"
            gradient="from-purple-500 to-fuchsia-700"
            comingSoon
          />
        </div>

        <p className="text-center text-xs text-ink-400 mt-8">
          💡 اللعبة الواحدة ~٢٥-٤٠ دقيقة حسب عدد اللاعبين
        </p>
      </div>
    </main>
  );
}

function ModeCard({
  icon,
  title,
  subtitle,
  description,
  playerCount,
  badge,
  badgeColor,
  gradient,
  comingSoon,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  playerCount: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  comingSoon?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      className={cn(
        "relative rounded-3xl overflow-hidden text-right transition-all bg-white border-2",
        comingSoon
          ? "border-ink-100 cursor-not-allowed opacity-75"
          : "border-ink-100 hover:border-primary-300 hover:shadow-xl hover:scale-[1.02]",
      )}
    >
      {/* تدرج علوي */}
      <div
        className={cn(
          "relative h-28 bg-gradient-to-br p-4 flex items-end",
          gradient,
        )}
      >
        <span
          className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black",
            badgeColor,
          )}
        >
          {badge}
        </span>
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
          {icon}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black mb-1">{title}</h3>
        <div className="text-xs text-ink-500 font-bold mb-3 uppercase tracking-wider">
          {subtitle}
        </div>
        <p className="text-sm text-ink-600 leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <span className="text-xs text-ink-500 font-bold">
            <Users className="inline w-3 h-3 ml-1" />
            {playerCount}
          </span>
          {comingSoon ? (
            <span className="text-xs text-ink-400 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              غير متاح حالياً
            </span>
          ) : (
            <span className="text-xs text-primary-600 font-bold">
              ابدأ ←
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
