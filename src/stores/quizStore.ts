import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { i18n } from "../i18n/i18n";

import partiesData from "../data/parties.json";
import surveysData from "../data/surveys.json";
import {
  computeScores as computeScoresUtility,
  type Party,
  type Question,
  type QuizResult,
} from "../utils/scoring";
import {
  decodeAndValidateAnswers,
  encodeAnswerValuesToBase64Url,
  UNANSWERED_VALUE,
} from "../validators/answers";
import { useUiStore, type SurveyMode } from "./uiStore";

export const useQuizStore = defineStore("quiz", () => {
  const answers = ref<Record<string, number>>({});
  const currentQuestionIndex = ref(0);
  const completed = ref(false);
  const ui = useUiStore();
  const mode = ref<SurveyMode>(ui.mode);
  const selectedQuestionIds = ref<string[]>([]);

  const parties = (partiesData as Party[]).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  interface QuestionMetadata {
    id: string;
    textKey: string;
    axis: string;
    weight: number;
    options: Array<{ value: number; label: string }>;
  }

  // Global translator wrapper to satisfy strict typing without `any`
  const tGlobal = i18n.global.t as unknown as (key: string) => string;
  function translate(key: string): string {
    return tGlobal(key);
  }

  function loadQuestionsFromI18n(ids?: string[]): Question[] {
    const questionsMetadata = import.meta.glob<{
      questions: QuestionMetadata[];
    }>("../data/questions.json", {
      eager: true,
      import: "default",
    })["../data/questions.json"] as { questions: QuestionMetadata[] };

    if (!questionsMetadata?.questions) {
      throw new Error("Could not load questions from questions.json");
    }

    const base = questionsMetadata.questions;
    const filtered =
      ids && ids.length > 0
        ? ids
            .map((id) => base.find((q) => q.id === id))
            .filter((q): q is QuestionMetadata => !!q)
        : base;

    return filtered.map((q: QuestionMetadata) => ({
      ...q,
      text: translate(q.textKey),
      textKey: q.textKey,
    }));
  }

  function loadSurvey(newMode: SurveyMode, questionIdsOverride?: string[]) {
    mode.value = newMode;
    ui.setMode(newMode);
    const surveyLists = (
      surveysData as unknown as { surveys: Record<string, string[]> }
    ).surveys;
    const ids =
      questionIdsOverride && questionIdsOverride.length > 0
        ? questionIdsOverride
        : surveyLists?.[newMode] || [];

    const q = loadQuestionsFromI18n(ids.length > 0 ? ids : undefined);
    selectedQuestionIds.value = q.map((qq) => qq.id);
    questions.value = q;
    reset();
  }

  const questions = ref<Question[]>([]);
  loadSurvey(mode.value);

  const currentQuestion = computed(
    () => questions.value[currentQuestionIndex.value]
  );
  const progress = computed(
    () => (currentQuestionIndex.value / questions.value.length) * 100
  );
  const answeredCount = computed(() => Object.keys(answers.value).length);
  const canProceed = computed(() => {
    const q = currentQuestion.value;
    return q ? answers.value[q.id] !== undefined : false;
  });

  function answerQuestion(questionId: string, optionIndex: number) {
    answers.value[questionId] = optionIndex;
  }

  function nextQuestion() {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
    } else {
      completed.value = true;
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  }

  function skipQuestion() {
    nextQuestion();
  }

  function computeScores(): QuizResult {
    return computeScoresUtility(answers.value, parties);
  }

  function reset() {
    answers.value = {};
    currentQuestionIndex.value = 0;
    completed.value = false;
  }

  function encodeAnswersToUrl(): string {
    const values = questions.value.map((q) => {
      const answer = answers.value[q.id];
      return answer === undefined ? UNANSWERED_VALUE : answer;
    });

    return encodeAnswerValuesToBase64Url(values);
  }

  function loadAnswersFromUrl(
    encoded: string,
    questionIdsParam?: string[]
  ): boolean {
    const questionIds =
      questionIdsParam && questionIdsParam.length > 0
        ? questionIdsParam
        : questions.value.map((q) => q.id);
    const result = decodeAndValidateAnswers(encoded, questionIds);

    if (result.success && result.answers) {
      answers.value = result.answers;
      completed.value =
        Object.keys(result.answers).length === questionIds.length;
      return true;
    }

    return false;
  }

  return {
    answers,
    currentQuestionIndex,
    completed,
    mode,
    currentQuestion,
    progress,
    answeredCount,
    canProceed,
    questions,
    selectedQuestionIds,
    parties,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    computeScores,
    reset,
    encodeAnswersToUrl,
    loadAnswersFromUrl,
    loadSurvey,
    getQuestions: () => questions.value,
    setCompleted: (value: boolean) => {
      completed.value = value;
    },
  };
});
