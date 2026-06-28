// أدوات تنسيق العرض بالعربية.

export function formatSAR(amount: number): string {
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} ر.س`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("ar-SA");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    calendar: "gregory",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function arabicDays(count: number): string {
  if (count === 1) return "يوماً واحداً";
  if (count === 2) return "يومين";
  if (count >= 3 && count <= 10) return `${count} أيام`;
  return `${count} يوماً`;
}

/** سنوات الخدمة كنص مختصر. */
export function serviceLength(hireIso: string): string {
  const days = (Date.now() - new Date(hireIso).getTime()) / (1000 * 60 * 60 * 24);
  const years = Math.floor(days / 365.25);
  const months = Math.floor((days - years * 365.25) / 30.44);
  if (years <= 0) return `${months} شهر`;
  if (months <= 0) return `${years} سنة`;
  return `${years} سنة و${months} شهر`;
}
