import { defineStore } from "pinia";
import { ref } from "vue";
import { i18n } from "../i18n/i18n";

type Locale = "en" | "af";
export const SURVEY_MODES = ["quick", "balanced", "full"] as const;
export type SurveyMode = (typeof SURVEY_MODES)[number];
export function isSurveyMode(m: string): m is SurveyMode {
  return (SURVEY_MODES as readonly string[]).includes(m);
}

export const useUiStore = defineStore("ui", () => {
  const lang = ref<Locale>(i18n.global.locale.value as Locale);
  const rawStoredMode = globalThis.localStorage?.getItem("mode");
  const storedMode = isSurveyMode(rawStoredMode || "")
    ? (rawStoredMode as SurveyMode)
    : ("full" as SurveyMode);
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
