import { defineStore } from "pinia";
import { ref } from "vue";
import { i18n } from "../i18n/i18n";

type Locale = "en" | "af";
export type SurveyMode = "fast" | "balanced" | "full";

export const useUiStore = defineStore("ui", () => {
  const lang = ref<Locale>(i18n.global.locale.value as Locale);
  const storedMode = (globalThis.localStorage?.getItem("mode") ||
    "full") as SurveyMode;
  const mode = ref<SurveyMode>(storedMode);

  function setLang(langCode: Locale) {
    lang.value = langCode;
    i18n.global.locale.value = langCode;
    localStorage.setItem("lang", langCode);
  }

  function setMode(newMode: SurveyMode) {
    mode.value = newMode;
    localStorage.setItem("mode", newMode);
  }

  return {
    lang,
    mode,
    setLang,
    setMode,
  };
});
