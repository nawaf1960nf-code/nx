/** Bilingual UI strings for the club platform. Arabic is the default locale. */

export type Locale = "ar" | "en";

export interface Bilingual {
  en: string;
  ar: string;
}

export const dict = {
  en: {
    brandName: "Apex Club",
    tagline: "Your personal training studio",
    nav: { map: "Muscle Map", generator: "Workout", consultant: "Consultant", calories: "Calories" },
    hero: {
      eyebrow: "Train smarter",
      title: "Pick a muscle. Get the exercises.",
      subtitle:
        "Tap any muscle on the body to see the best exercises for it — with sets, equipment and step-by-step form.",
      cta: "Explore the muscle map",
    },
    map: {
      title: "Interactive Muscle Map",
      hint: "Tap a muscle to see its exercises",
      front: "Front",
      back: "Back",
      selected: "Selected muscle",
      none: "No muscle selected",
      nonePrompt: "Tap a highlighted muscle on the body to load its exercises.",
      exercisesFor: (m: string) => `Exercises for ${m}`,
      count: (n: number) => `${n} exercise${n === 1 ? "" : "s"}`,
      equipment: "Equipment",
      steps: "How to perform",
      level: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    },
    features: {
      title: "Everything in one place",
      subtitle: "A complete training companion — built around you.",
      items: {
        map: { title: "Muscle Map", desc: "Tap a muscle, get its best exercises with proper form." },
        generator: { title: "Workout Generator", desc: "A weekly split tailored to your days, goal and level." },
        consultant: { title: "AI Consultant", desc: "Share your stats and get personal training guidance." },
        calories: { title: "Calorie Guide", desc: "Daily calories and macros mapped to your goal." },
      },
      soon: "Coming soon",
    },
    footer: "Apex Club · Train with intention",
  },
  ar: {
    brandName: "نادي أبيكس",
    tagline: "ستوديو تدريبك الشخصي",
    nav: { map: "خريطة العضلات", generator: "التمارين", consultant: "المستشار", calories: "السعرات" },
    hero: {
      eyebrow: "تدرّب بذكاء",
      title: "اختر العضلة. تظهر لك التمارين.",
      subtitle:
        "اضغط على أي عضلة في الجسم لتشاهد أفضل التمارين لها — مع المجموعات والمعدّات وطريقة الأداء خطوة بخطوة.",
      cta: "استكشف خريطة العضلات",
    },
    map: {
      title: "خريطة العضلات التفاعلية",
      hint: "اضغط على عضلة لعرض تمارينها",
      front: "أمامي",
      back: "خلفي",
      selected: "العضلة المختارة",
      none: "لم تُختر عضلة",
      nonePrompt: "اضغط على عضلة مُضاءة في الجسم لتحميل تمارينها.",
      exercisesFor: (m: string) => `تمارين ${m}`,
      count: (n: number) => `${n} تمرين`,
      equipment: "المعدّات",
      steps: "طريقة الأداء",
      level: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" },
    },
    features: {
      title: "كل شيء في مكان واحد",
      subtitle: "رفيق تدريب متكامل — مبني حولك أنت.",
      items: {
        map: { title: "خريطة العضلات", desc: "اضغط على عضلة لتحصل على أفضل تمارينها بالأداء الصحيح." },
        generator: { title: "مولّد التمارين", desc: "تقسيمة أسبوعية مفصّلة حسب أيامك وهدفك ومستواك." },
        consultant: { title: "المستشار الذكي", desc: "شارك بياناتك لتحصل على إرشاد تدريبي شخصي." },
        calories: { title: "دليل السعرات", desc: "سعراتك اليومية والماكروز حسب هدفك." },
      },
      soon: "قريبًا",
    },
    footer: "نادي أبيكس · تدرّب بنيّة",
  },
};

export type Dict = (typeof dict)["en"];
