// Tiny i18n: swaps text nodes that carry data-lang-en / data-lang-ar.
window.AppI18n = (() => {
  let current = "en";

  function apply(lang) {
    current = lang;
    document.documentElement.lang = lang;
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.querySelectorAll("[data-lang-en]").forEach(el => {
      const txt = el.getAttribute("data-lang-" + lang);
      if (txt != null) el.textContent = txt;
    });
    const toggle = document.getElementById("lang-toggle-text");
    if (toggle) toggle.textContent = lang === "en" ? "العربية" : "English";
  }

  function get() { return current; }
  function t(en, ar) { return current === "ar" && ar ? ar : en; }

  return { apply, get, t };
})();
