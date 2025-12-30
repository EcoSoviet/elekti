import { createI18n } from "vue-i18n";
import en from "../data/translations/en.json";

type MessageSchema = typeof en;

let afTranslations: MessageSchema | undefined;

const loadAfrikaansTranslations = async (): Promise<MessageSchema> => {
  if (afTranslations) {
    return afTranslations;
  }
  const module = await import("../data/translations/af.json");
  afTranslations = module.default as MessageSchema;
  return afTranslations;
};

function getInitialLocale(): string {
  const stored =
    typeof globalThis !== "undefined" &&
    globalThis.localStorage &&
    typeof globalThis.localStorage.getItem === "function"
      ? (globalThis.localStorage.getItem("lang") ?? undefined)
      : undefined;
  if (stored && ["en", "af"].includes(stored)) {
    return stored;
  }

  const browserLangArray = navigator.language.toLowerCase().split("-");
  const browserLang = browserLangArray[0] || "en";
  const supported = ["en", "af"];

  return supported.includes(browserLang) ? browserLang : "en";
}

const initialLocale = getInitialLocale();
const messages: Record<string, MessageSchema> = {
  en,
};

if (initialLocale === "af") {
  const af = await loadAfrikaansTranslations();
  messages.af = af;
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: "en",
  messages,
});

export const loadAFTranslations = async () => {
  if (!messages.af) {
    messages.af = await loadAfrikaansTranslations();
  }
  return messages.af;
};

export const availableLocales = [
  { code: "en", name: "English" },
  { code: "af", name: "Afrikaans" },
];
