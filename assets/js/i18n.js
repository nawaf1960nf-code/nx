/* Bloom — tiny i18n helper.
   Elements with data-lang-en / data-lang-ar are switched on language change. */
const i18n = (function () {
  let lang = 'en';
  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-lang-en]').forEach(el => {
      const v = el.getAttribute('data-lang-' + lang);
      if (v != null) {
        if (el.placeholder !== undefined && el.tagName === 'INPUT' && el.type !== 'submit') {
          // placeholder rebind if attribute exists
          if (el.hasAttribute('data-ph-en')) el.placeholder = el.getAttribute('data-ph-' + lang) || el.placeholder;
        }
        el.textContent = v;
      }
    });
  }
  function set(l) { lang = (l === 'ar' ? 'ar' : 'en'); apply(); }
  function get() { return lang; }
  function t(en, ar) { return lang === 'ar' ? (ar || en) : en; }
  return { set, get, t, apply };
})();
