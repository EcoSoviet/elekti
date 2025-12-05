import { createI18n } from "vue-i18n";
import af from "./data/translations/af.json";
import en from "./data/translations/en.json";
import st from "./data/translations/st.json";
import tn from "./data/translations/tn.json";
import xh from "./data/translations/xh.json";
import zu from "./data/translations/zu.json";

function getInitialLocale(): string {
  const stored = localStorage.getItem("lang");
  if (stored && ["en", "af", "zu", "xh", "tn", "st"].includes(stored)) {
    return stored;
  }

  const browserLangArray = navigator.language.toLowerCase().split("-");
  const browserLang = browserLangArray[0] || "en";
  const supported = ["en", "af", "zu", "xh", "tn", "st"];

  return supported.includes(browserLang) ? browserLang : "en";
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: "en",
  messages: {
    en,
    af,
    zu,
    xh,
    tn,
    st,
  },
});

export const availableLocales = [
  { code: "en", name: "English" },
  { code: "af", name: "Afrikaans" },
  { code: "zu", name: "isiZulu" },
  { code: "xh", name: "isiXhosa" },
  { code: "tn", name: "Setswana" },
  { code: "st", name: "Sesotho" },
];
