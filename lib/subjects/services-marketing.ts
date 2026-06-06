import type { Bilingual, TopicId, Chapter, Question, EssayQuestion } from "../types";
import { QUESTION_BANK } from "../questions";
import { KNOWLEDGE_BASE } from "../knowledge-base";
import { SERVICES_MARKETING_ESSAYS } from "../essays/services-marketing";

export interface SubjectTopic {
  id: TopicId;
  label: Bilingual;
  chapter: Chapter;
}

export interface Subject {
  id: string;
  name: Bilingual;
  tagline: Bilingual;
  /** lucide-react icon name (see components/SubjectIcon.tsx). */
  icon: string;
  accent: string;
  glow: string;
  chapters: Chapter[];
  chapterTitles: Record<number, Bilingual>;
  topics: Record<string, SubjectTopic>;
  questions: Question[];
  /** Open-ended KSU-style questions, AI-graded. Optional per subject. */
  essays?: EssayQuestion[];
  knowledge: Record<string, string>;
  available: boolean;
}

const topics: Record<string, SubjectTopic> = {
  "flower-of-service": { id: "flower-of-service", label: { en: "Flower of Service", ar: "زهرة الخدمة" }, chapter: 4 },
  "facilitating-services": { id: "facilitating-services", label: { en: "Facilitating Services", ar: "الخدمات الميسِّرة" }, chapter: 4 },
  "enhancing-services": { id: "enhancing-services", label: { en: "Enhancing Services", ar: "الخدمات المعزِّزة" }, chapter: 4 },
  "branding-alternatives": { id: "branding-alternatives", label: { en: "Branding Alternatives", ar: "بدائل العلامة التجارية" }, chapter: 7 },
  "new-service-development": { id: "new-service-development", label: { en: "New Service Development", ar: "تطوير الخدمات الجديدة" }, chapter: 7 },
  "marketing-communications": { id: "marketing-communications", label: { en: "Marketing Communications", ar: "الاتصالات التسويقية" }, chapter: 7 },
  "5ws-model": { id: "5ws-model", label: { en: "5Ws Model", ar: "نموذج الـ 5Ws" }, chapter: 7 },
  "word-of-mouth": { id: "word-of-mouth", label: { en: "Word of Mouth", ar: "الكلمة المنطوقة (WOM)" }, chapter: 7 },
  "corporate-design": { id: "corporate-design", label: { en: "Corporate Design", ar: "التصميم المؤسسي" }, chapter: 7 },
  blueprinting: { id: "blueprinting", label: { en: "Blueprinting", ar: "التخطيط (Blueprinting)" }, chapter: 8 },
  flowcharting: { id: "flowcharting", label: { en: "Flowcharting", ar: "المخطط الانسيابي" }, chapter: 8 },
  "service-blueprint": { id: "service-blueprint", label: { en: "Service Blueprint", ar: "مخطط الخدمة" }, chapter: 8 },
  "fail-proofing": { id: "fail-proofing", label: { en: "Fail-Proofing", ar: "التأمين ضد الفشل" }, chapter: 8 },
  "service-standards": { id: "service-standards", label: { en: "Service Standards", ar: "معايير الخدمة" }, chapter: 8 },
  ssts: { id: "ssts", label: { en: "Self-Service Technologies (SSTs)", ar: "تقنيات الخدمة الذاتية (SSTs)" }, chapter: 8 },
  servicescape: { id: "servicescape", label: { en: "Servicescape", ar: "بيئة الخدمة (Servicescape)" }, chapter: 10 },
  "ambient-conditions": { id: "ambient-conditions", label: { en: "Ambient Conditions", ar: "الظروف المحيطة" }, chapter: 10 },
  "pleasure-arousal": { id: "pleasure-arousal", label: { en: "Pleasure & Arousal", ar: "المتعة والإثارة" }, chapter: 10 },
  "mehrabian-russell": { id: "mehrabian-russell", label: { en: "Mehrabian-Russell Model", ar: "نموذج مهرابيان-راسل" }, chapter: 10 },
  "role-stress": { id: "role-stress", label: { en: "Role Stress", ar: "ضغوط الدور" }, chapter: 11 },
  "boundary-spanners": { id: "boundary-spanners", label: { en: "Boundary Spanners", ar: "موظفو الحدود" }, chapter: 11 },
  empowerment: { id: "empowerment", label: { en: "Empowerment", ar: "التمكين" }, chapter: 11 },
  "service-culture": { id: "service-culture", label: { en: "Service Culture", ar: "ثقافة الخدمة" }, chapter: 11 },
  "internal-marketing": { id: "internal-marketing", label: { en: "Internal Marketing", ar: "التسويق الداخلي" }, chapter: 11 },
  "cycle-of-success": { id: "cycle-of-success", label: { en: "Cycle of Success", ar: "دورة النجاح" }, chapter: 11 },
  "cycle-of-failure": { id: "cycle-of-failure", label: { en: "Cycle of Failure", ar: "دورة الفشل" }, chapter: 11 },
  "emotional-labor": { id: "emotional-labor", label: { en: "Emotional Labor", ar: "العمل العاطفي" }, chapter: 11 },
};

export const servicesMarketing: Subject = {
  id: "services-marketing",
  name: { en: "Services Marketing", ar: "تسويق الخدمات" },
  tagline: {
    en: "Lovelock & Wirtz · Chapters 4, 7, 8, 10 & 11",
    ar: "لوفلوك وويرتز · الفصول ٤ و٧ و٨ و١٠ و١١",
  },
  icon: "Megaphone",
  accent: "#818cf8",
  glow: "rgba(99, 102, 241, 0.45)",
  chapters: [4, 7, 8, 10, 11],
  chapterTitles: {
    4: { en: "Developing Service Products & Branding (Flower of Service)", ar: "تطوير منتجات الخدمة والعلامة التجارية (زهرة الخدمة)" },
    7: { en: "Promoting Services & Educating Customers", ar: "الترويج للخدمات وتثقيف العملاء" },
    8: { en: "Designing & Managing Service Processes", ar: "تصميم وإدارة عمليات الخدمة" },
    10: { en: "Crafting the Service Environment (Servicescape)", ar: "صياغة بيئة الخدمة (Servicescape)" },
    11: { en: "Managing People for Service Advantage", ar: "إدارة الأفراد لتحقيق ميزة الخدمة" },
  },
  topics,
  questions: QUESTION_BANK,
  essays: SERVICES_MARKETING_ESSAYS,
  knowledge: KNOWLEDGE_BASE as Record<string, string>,
  available: true,
};
