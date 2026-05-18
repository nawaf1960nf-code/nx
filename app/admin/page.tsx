"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/lib/auth-context";
import {
  Plus,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Users,
  Ticket,
  TrendingUp,
  Gamepad2,
  ArrowLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "nawaf1960nf@gmail.com";

interface CodeRow {
  id: string;
  code: string;
  plays_granted: number;
  package_name: string | null;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
}

interface Stats {
  total_users: number;
  total_codes: number;
  total_redemptions: number;
  total_plays_sold: number;
}

const PACKAGES = [
  { name: "كود لعبة واحدة", plays: 1, suggested_price: 5 },
  { name: "حزمة عادية", plays: 3, suggested_price: 12 },
  { name: "حزمة عائلة", plays: 5, suggested_price: 18 },
  { name: "حزمة بطل", plays: 10, suggested_price: 30 },
  { name: "حزمة VIP", plays: 25, suggested_price: 60 },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentlyCreated, setRecentlyCreated] = useState<CodeRow[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // النموذج
  const [playsGranted, setPlaysGranted] = useState(3);
  const [packageName, setPackageName] = useState("حزمة عادية");
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirectTo=/admin");
        return;
      }
      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/");
        return;
      }
      fetchAll();
    }
  }, [user, loading, router]);

  const fetchAll = async () => {
    const [codesRes, statsRes] = await Promise.all([
      fetch("/api/admin/codes"),
      fetch("/api/admin/stats"),
    ]);
    if (codesRes.ok) {
      const data = await codesRes.json();
      setCodes(data.codes ?? []);
    }
    if (statsRes.ok) {
      const data = await statsRes.json();
      setStats(data);
    }
  };

  const handleCreate = async () => {
    setError(null);
    setCreating(true);
    setRecentlyCreated([]);
    try {
      const res = await fetch("/api/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plays_granted: playsGranted,
          package_name: packageName || null,
          count,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذّر إنشاء الأكواد");
        return;
      }
      setRecentlyCreated(data.codes ?? []);
      await fetchAll();
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    await fetch("/api/admin/codes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !is_active }),
    });
    fetchAll();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const copyAll = () => {
    const text = recentlyCreated.map((c) => c.code).join("\n");
    navigator.clipboard.writeText(text);
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mesh">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <span className="bg-gold-500/15 text-gold-600 px-3 py-1 rounded-full text-xs font-black">
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
          <Link href="/">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              الرئيسية
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          لوحة <span className="text-primary-500">التحكم</span>
        </h1>
        <p className="text-ink-500 mb-8">إدارة الأكواد والإحصائيات</p>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="المستخدمون"
            value={stats?.total_users ?? 0}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={<Ticket className="w-5 h-5" />}
            label="إجمالي الأكواد"
            value={stats?.total_codes ?? 0}
            color="bg-purple-50 text-purple-600"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="استخدامات"
            value={stats?.total_redemptions ?? 0}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={<Gamepad2 className="w-5 h-5" />}
            label="ألعاب مباعة"
            value={stats?.total_plays_sold ?? 0}
            color="bg-yellow-50 text-yellow-600"
          />
        </div>

        {/* نموذج إنشاء الأكواد */}
        <div className="bg-white rounded-3xl border-2 border-ink-100 p-6 mb-8">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إنشاء أكواد جديدة
          </h2>

          {/* باكجات مقترحة */}
          <div className="mb-5">
            <div className="text-xs font-bold text-ink-500 mb-2">
              اختر باكج جاهز:
            </div>
            <div className="flex flex-wrap gap-2">
              {PACKAGES.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setPlaysGranted(p.plays);
                    setPackageName(p.name);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-full text-xs font-bold transition border-2",
                    playsGranted === p.plays && packageName === p.name
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-white text-ink-600 border-ink-200 hover:border-ink-400",
                  )}
                >
                  {p.name} ({p.plays} {p.plays === 1 ? "لعبة" : "ألعاب"})
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <Field label="عدد الألعاب للكود">
              <input
                type="number"
                min={1}
                max={1000}
                value={playsGranted}
                onChange={(e) => setPlaysGranted(Number(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-ink-200 rounded-xl font-bold"
              />
            </Field>
            <Field label="اسم الباكج (اختياري)">
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-ink-200 rounded-xl font-bold"
                placeholder="حزمة عادية"
              />
            </Field>
            <Field label="عدد الأكواد">
              <input
                type="number"
                min={1}
                max={200}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-ink-200 rounded-xl font-bold"
              />
            </Field>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm font-bold flex items-start gap-2 mb-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={handleCreate}
            loading={creating}
            disabled={creating}
            size="lg"
          >
            أنشئ الآن
          </Button>
        </div>

        {/* الأكواد المُنشأة حديثاً */}
        {recentlyCreated.length > 0 && (
          <div className="bg-primary-50 border-2 border-primary-200 rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-primary-900">
                ✨ تم إنشاء {recentlyCreated.length} كود
              </h3>
              <Button size="sm" variant="secondary" onClick={copyAll}>
                <Copy className="w-4 h-4 ml-1" /> نسخ الكل
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {recentlyCreated.map((c) => (
                <button
                  key={c.id}
                  onClick={() => copyCode(c.code)}
                  className="bg-white border-2 border-primary-200 rounded-xl p-3 text-right hover:border-primary-500 transition flex items-center justify-between gap-2"
                >
                  <code
                    className="font-mono font-black text-lg text-primary-900"
                    dir="ltr"
                  >
                    {c.code}
                  </code>
                  {copiedCode === c.code ? (
                    <Check className="w-4 h-4 text-primary-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-ink-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* قائمة كل الأكواد */}
        <div className="bg-white rounded-3xl border-2 border-ink-100 p-6">
          <h2 className="text-xl font-black mb-4">كل الأكواد</h2>
          {codes.length === 0 ? (
            <div className="text-center text-ink-400 py-12">
              ما في أكواد. أنشئ واحد فوق.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-ink-500 font-bold border-b border-ink-100">
                    <th className="text-right py-2">الكود</th>
                    <th className="text-right py-2">الباكج</th>
                    <th className="text-right py-2">ألعاب</th>
                    <th className="text-right py-2">استخدام</th>
                    <th className="text-right py-2">الحالة</th>
                    <th className="text-right py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-ink-50 hover:bg-ink-50/50"
                    >
                      <td className="py-3">
                        <button
                          onClick={() => copyCode(c.code)}
                          className="font-mono font-bold text-ink-800 hover:text-primary-500"
                          dir="ltr"
                        >
                          {c.code}
                        </button>
                      </td>
                      <td className="py-3 text-ink-600">
                        {c.package_name ?? "-"}
                      </td>
                      <td className="py-3 font-bold">{c.plays_granted}</td>
                      <td className="py-3 text-ink-600">
                        {c.used_count}/{c.max_uses}
                      </td>
                      <td className="py-3">
                        {c.is_active ? (
                          c.used_count >= c.max_uses ? (
                            <span className="text-xs bg-ink-100 text-ink-600 px-2 py-1 rounded-full font-bold">
                              مُستخدم
                            </span>
                          ) : (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                              فعّال
                            </span>
                          )
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                            معطّل
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggle(c.id, c.is_active)}
                          className="text-ink-400 hover:text-red-500"
                          title={c.is_active ? "تعطيل" : "تفعيل"}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-ink-100 p-4">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center mb-2",
          color,
        )}
      >
        {icon}
      </div>
      <div className="text-xs text-ink-500 font-bold mb-1">{label}</div>
      <div className="text-2xl font-black tabular-nums">{value.toLocaleString("ar-EG")}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-ink-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
