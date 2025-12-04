# SPEC — South African Voter Quiz (MVP)

## 1. Purpose

Build a mobile-first web app that quizzes users (≤20 questions) and recommends 1) a primary South African political party to vote for and 2) an alternative (second choice). The app supports a core set of 11 political parties expected to contest future national or local elections. It is designed to be modern, neutral, and timeless in tone, helping users identify parties that align with their views regardless of the specific election cycle.

---

## 2. High-level constraints

* Framework: Vue 3 (Composition API) + Vite
* State: Pinia
* Router: Vue Router
* i18n: vue-i18n (EN, AF, ZU, XH, TN)
* Icons: Lucide Vue Next
* Styling: Plain CSS (mobile-first, theme variables)
* Data storage: JSON files in `src/data/`
* Persistence: localStorage only (language preference, last result)
* No authentication
* Max questions: 20

---

## 3. MVP scope

* Quiz flow with up to 20 questions
* Scoring engine (weighted scoring) that maps answers to party scores
* Primary and alternative party selection algorithm
* English + Afrikaans + Zulu + Xhosa + Tswana
* Support 11 parties (see section 6)
* Responsive mobile-first UI, single theme with swap-ready variables
* Local JSON files for: parties, questions, scoring weights, translations
* Minimal analytics: local only (no external tracking)

---

## 4. UX & UI

### Tone

Modern, clean, neutral; avoid partisan styling. Use South African colour cues (subtle warm palette inspired by flag colours) but keep it tasteful and accessible.

### Layout

* Mobile-first single-column layout
* Top nav: brand + language selector (detect & show current)
* Main screens: Landing → Quiz → Results → About / Methodology
* Footer: about, data sources, privacy

### Flow

1. Landing: short intro, "Start quiz" CTA, language autodetect with option to change (store in localStorage)
2. Quiz: show one question per screen, progress bar, skip/back options
3. Finalise: show primary match and alternative; show score breakdown by party, short party descriptions, and recommended reading link
4. Share / Save: allow copying results to clipboard; no login

---

## 5. Content model (JSON)

Files stored under `src/data/`:

* `parties.json` — list of supported parties
* `questions.json` — array of question objects
* `scoring.json` — mapping of answers → weightings per party
* `translations/*.json` — i18n strings (EN, AF, ZU, XH, TN)

### `parties.json` schema

```json
[
  {
    "id": "anc",
    "name": "African National Congress",
    "short": "ANC",
    "descriptionKey": "party.anc.desc",
    "colour": "#hex",
    "logo": "assets/parties/anc.svg"
  }
]
```

### `questions.json` schema

```json
[
  {
    "id": "q1",
    "type": "single", // future: multi, rank
    "textKey": "q1.text",
    "options": [
      { "id": "a", "textKey": "q1.a", "weightKey": "q1.a.weights" },
      { "id": "b", "textKey": "q1.b", "weightKey": "q1.b.weights" }
    ]
  }
]
```

### `scoring.json` — example weight object

```json
{
  "q1.a.weights": { "anc": 1, "da": -0.5, "eff": -1, "mk": 0 },
  "q1.b.weights": { "anc": -1, "da": 1, "eff": 0.5 }
}
```

Weights are floats; positive supports, negative opposes; zero neutral.

---

## 6. Parties (as of 2026 LGE context)

The app includes 11 South African political parties expected to be active across future national and local elections. This includes both parliamentary parties and others like UFC and SACP, which may contest local elections independently.

**Parties to include (IDs):**

* anc — African National Congress
* da — Democratic Alliance
* mk — uMkhonto we Sizwe Party
* eff — Economic Freedom Fighters
* ifp — Inkatha Freedom Party
* pa — Patriotic Alliance
* vfplus — Freedom Front Plus
* actionsa — ActionSA
* acdp — African Christian Democratic Party
* ufc — Unite for Change
* sacp — South African Communist Party

Each party has an ID, name, short name, logo, colour, and description translation key.

---

## 7. Scoring algorithm (MVP)

1. Each question answer contributes a vector of weights (from `scoring.json`) across parties.
2. User's total score for each party is the sum of weights across answered questions.
3. Normalize scores to range 0..1 using min-max on the vector.
4. Primary party = party with highest normalized score.
5. Alternative party = the party with the next-highest normalized score that is not within a small tie-margin (configurable, e.g. 0.02). If a tie margin occurs, list both as alternatives.

**Tie-breaking / sanity checks**

* If top score < threshold (e.g. 0.15 after normalization) show "No strong match" and present top 3 ranked.
* Disallow same party for primary + alternative.

**Why this approach**

* Lightweight, explainable, and easy to update via JSON. Later we can add PCA or cosine similarity on party vectors for better matching.

---

## 8. Questions

* Keep ≤20 questions. Each question should focus on a single policy axis (e.g., economy, land reform, energy, corruption, social grants, crime, immigration, education, healthcare, local governance).
* Prefer single-choice Likert-style options (Strongly agree, Agree, Neutral, Disagree, Strongly disagree) which map to weight multipliers.
* Provide a question taxonomy to ensure balance across topics.

Example question categories (10): economy, land & agrarian reform, energy & Eskom, corruption & governance, crime & policing, social services, healthcare, education, immigration, local services & housing.

---

## 9. Internationalization

* All UI strings in `translations/<lang>.json`.
* Party descriptions, question texts, option labels must all have translations.
* Language autodetection: use `navigator.languages` and fall back to English. Save preference in `localStorage.lang`.
* Supported codes: en, af, zu, xh, tn.

---

## 10. App structure (file outline)

```
src/
  assets/
  components/
    QuizQuestion.vue
    ProgressBar.vue
    PartyCard.vue
    LanguageSelector.vue
    ResultBreakdown.vue
  data/
    parties.json
    questions.json
    scoring.json
    translations/
  stores/
    quizStore.js
    uiStore.js
  views/
    Landing.vue
    Quiz.vue
    Results.vue
    About.vue
  App.vue
  main.js
  router.js
```

---

## 11. Pinia store (suggested)

**quizStore**

* state: `answers`, `currentQuestionIndex`, `scores`, `completed`
* actions: `answerQuestion(qId, optionId)`, `computeScores()`, `reset()`

**uiStore**

* state: `lang`, `themeVars`
* actions: `setLang()`

---

## 12. Accessibility

* Keyboard navigable
* Proper ARIA labels for question options
* Contrast ratio checks for text vs background
* Screen-reader friendly result descriptions

---

## 13. Testing

* Unit tests for scoring algorithm (Jest/Vitest)
* Integration test for full quiz flow
* Snapshot tests for critical components

---

## 14. Privacy

* No backend, no analytics by default
* localStorage only for language and last-quiz result
* Provide a short privacy statement in About

---

## 15. Extensibility & future improvements

* Add more languages
* Add multi-select / ranked-choice questions
* Add region-based recommendations (provincial variants)
* Use small backend for versioned JSON and feature flags

---

## 16. Deliverables for initial sprint

* SPEC.md (this document)
* Wireframe sketches for Landing, Quiz, Results
* Working Vue app with questions.json, parties.json, scoring.json
* i18n base translations (English) and placeholders for others
* Tests for scoring logic

---

## 17. Notes on data sources

Use official IEC results and reputable coverage when updating party lists and percentages.
Make sure to verify that included parties are contesting under their own name.
