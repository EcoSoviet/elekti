import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useQuizStore } from "./quizStore";
import { useUiStore } from "./uiStore";

describe("quizStore surveys", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("loads quick survey (12 questions)", () => {
    const quiz = useQuizStore();
    const ui = useUiStore();
    ui.setMode("quick");
    quiz.loadSurvey("quick");
    expect(quiz.mode).toBe("quick");
    expect(quiz.questions.length).toBe(12);
  });

  it("loads balanced survey (24 questions)", () => {
    const quiz = useQuizStore();
    quiz.loadSurvey("balanced");
    expect(quiz.mode).toBe("balanced");
    expect(quiz.questions.length).toBe(24);
  });

  it("encodes/decodes with custom question order from URL", () => {
    const quiz = useQuizStore();
    const ids = ["q1", "q2", "q3", "q4"];
    quiz.loadSurvey("full", ids);
    quiz.answerQuestion("q1", 0);
    quiz.answerQuestion("q3", 2);
    const enc = quiz.encodeAnswersToUrl();
    quiz.loadSurvey("full", ids);
    const ok = quiz.loadAnswersFromUrl(enc, ids);
    expect(ok).toBe(true);
    expect(quiz.answers["q1"]).toBe(0);
    expect(quiz.answers["q2"]).toBeUndefined();
    expect(quiz.answers["q3"]).toBe(2);
    expect(Object.keys(quiz.answers).length).toBe(2);
  });
});
