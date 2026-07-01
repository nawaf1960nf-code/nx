// أدوات التحقق من صحة المدخلات (بريد، جوال سعودي، آيبان) وإخفاء البيانات الحساسة.

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** جوال سعودي: يبدأ بـ 05 ويتكون من 10 أرقام. */
export function isValidSaudiMobile(value: string): boolean {
  return /^05\d{8}$/.test(value.replace(/[\s-]/g, ""));
}

export function normalizeIban(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

/**
 * تحقق آيبان سعودي: SA + 22 رقماً، مع خوارزمية MOD-97 القياسية (ISO 13616).
 */
export function isValidSaudiIban(value: string): boolean {
  const iban = normalizeIban(value);
  if (!/^SA\d{22}$/.test(iban)) return false;
  // نقل أول 4 خانات إلى النهاية وتحويل الحروف إلى أرقام (A=10 ... Z=35).
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let remainder = 0;
  for (const ch of numeric) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  return remainder === 1;
}

/** إخفاء الآيبان في العرض: أول 4 وآخر 4 خانات فقط. */
export function maskIban(value: string): string {
  const iban = normalizeIban(value);
  if (iban.length < 8) return value;
  return `${iban.slice(0, 4)} •••• •••• •••• ${iban.slice(-4)}`;
}
