# Elekti

> A multilingual political alignment quiz that matches South African voters to parties via weighted scoring.

Elekti is a Vue 3 + Pinia single-page application that walks users through 50 policy questions, normalises their answers against curated party data, and surfaces tailored recommendations. The project emphasises strict localization, reproducible scoring, and a lean state-management layer so new questions or parties can be introduced without rewiring the UI.

## Highlights

- 🎯 **Policy matching** – 50 policy questions mapped to 12 political axes; each question has weighted impact on party alignment scores.
- 🌍 **Fully localized content** – All questions live in `src/data/translations/{en,af}.json`; metadata references translations via `textKey`.
- 🧠 **Deterministic scoring** – `src/utils/scoring.ts` uses axis-based alignment with similarity scoring, normalized per-party, and tracks top 3 policy axes.
- 🧭 **URL-shareable results** – Answers encode into a comma-delimited string, enabling sharable quiz states across locales.
- ⚙️ **Vite + Vue 3** – Fast local dev with TypeScript, Pinia state management, and vue-i18n multilingual support.

## Architecture Overview

- **Views** – Landing, Quiz, Results, and About routes under `src/views/*` managed by `vue-router`.
- **State** – `quizStore` loads questions from i18n and `questions.json` metadata, manages answers and quiz progress; `uiStore` handles locale persistence.
- **Data** – `parties.json` defines 11 parties; `questions.json` contains 50 questions with metadata (axis, weight, textKey); `translations/{en,af}.json` hold all UI text and question content.
- **Scoring flow** – `computeScores()` calculates axis-based similarity between user answers and party positions, returns ranked parties with top policy axes and confidence level.

```
src/
├── components/          # QuizQuestion, PartyCard, ResultBreakdown, etc.
├── data/
│   ├── axes.json        # 12 political axis definitions
│   ├── parties.json     # 11 party metadata (names, colors, descriptions)
│   ├── party_positions.json  # Party positions on each axis
│   ├── questions.json   # 50 questions with textKey refs, axis, weight
│   └── translations/
│       ├── en.json      # English UI + question text
│       └── af.json      # Afrikaans UI + question text
├── stores/              # Pinia stores (quiz + ui) and unit tests
├── utils/               # scoring logic + tests
└── views/               # Route-level components
```

## Getting Started

Prerequisites: Node >= 22.21.1 and npm.

```sh
npm install
npm run dev
```

Visit `http://localhost:5173` (default Vite port).

## Key Scripts

| Command                            | Description                                                |
| ---------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                      | Start the Rolldown-powered Vite dev server.                |
| `npm run build`                    | Runs `vue-tsc --build` then bundles. Fails on type errors. |
| `npm run preview`                  | Preview the production build locally.                      |
| `npm run test` / `npm run test:ui` | Vitest in happy-dom mode; UI variant opens the inspector.  |
| `npm run lint`                     | Executes `oxlint` then ESLint with cache + autofix.        |
| `npm run format`                   | Prettier with organize-imports + package.json sorting.     |

## Content & Localization Workflow

### Adding a New Question

1. **Determine axis and directionality**
   - Choose one of the 12 axes from `src/data/axes.json`
   - Decide if the question is phrased positively (aligns with +1 direction) or negatively (aligns with -1 direction)
   - If negatively phrased, you'll need `"reverseScoring": true`

2. **Add to both translation files** – Edit `src/data/translations/en.json` and `src/data/translations/af.json` under the `questions` object:

   ```json
   "q51": {
     "text": "Your question text here (positively or negatively framed)",
     "axis": "economic_left_right"
   }
   ```

   **Add the same key with localized text to both en.json and af.json.**

3. **Add question metadata** – Append to `src/data/questions.json`:

   ```json
   {
     "id": "q51",
     "textKey": "questions.q51.text",
     "axis": "economic_left_right",
     "weight": 1.5,
     "reverseScoring": false
   }
   ```

   Key fields:
   - `id`: Unique question identifier
   - `textKey`: Reference to translation file key (format: `questions.q[N].text`)
   - `axis`: Must match one of the 12 axes in `axes.json`
   - `weight`: Importance (typically 1.0–2.0)
   - `reverseScoring`: `true` if the question is phrased from the opposite axis direction; `false` (or omit) otherwise

   **When should you use `reverseScoring: true`?**
   - If the question is phrased from a right-wing or market-oriented perspective on an economic/market axis → `true`
   - If the question asks about protectionism on the global_vs_local axis → `true`
   - If the question asks about law & order on the law_order_vs_liberty axis → `true`
   - If the question asks about incremental reform on the transformation_vs_continuity axis → `true`
   - Otherwise → `false` (or omit)

4. **Add party positions** – Update `src/data/party_positions.json` to include position scores for all 11 parties on the relevant axis(es):

   ```json
   "parties": {
     "anc": { "economic_left_right": 0.3, ... },
     "da": { "economic_left_right": -0.65, ... },
     ...
   }
   ```

   Use values in range [-1, 1] representing party stance on the axis.

5. **Verify** – Run `npm run test` to ensure no type errors; the quiz store auto-loads from translations.

### Removing a Question

1. Delete the question key from both `en.json` and `af.json` translation files.
2. Remove the question object from `src/data/questions.json`.
3. Done—no other files need updates. Question IDs remain stable.

### Modifying a Question

- **Text** – Update in both translation files (`en.json` and `af.json`) under `questions.q[N].text`.
- **Axis/Weight** – Edit `src/data/questions.json`; axis determines which party positions affect scoring, weight scales the contribution.
- **Reverse Scoring** – If you change the question phrasing direction (e.g., from positive to negative framing), update the `reverseScoring` field accordingly.
- **Party positions** – Modify `src/data/party_positions.json` if stance should change.
- **Do not change** – The question `id` (e.g., `q51`); this is the stable identifier.

## Scoring Engine

The axis-based alignment system replaces naive text matching:

- **Axes** – 12 political dimensions from `axes.json`, each with a defined positive (+1) and negative (-1) direction
- **Questions** – 50 questions, each mapped to one axis with a weight (1.0–2.0)
- **Party positions** – Each party's stance on all axes (range: -1 to +1)
- **Reverse scoring** – Some questions are phrased from opposing viewpoints (e.g., right-wing statements for left-wing axes). The `reverseScoring` field in `questions.json` indicates whether user answers should be inverted before comparison
- **Similarity scoring** – For each axis: `1 - abs(userAnswer - partyPosition)` weighted by question weight
- **Top axes** – Show the 3 strongest alignment axes in results
- **Confidence** – `high` / `medium` / `low` based on score spread

### Understanding Question Direction & Reverse Scoring

Each axis has a defined direction:

| Axis                           | Positive (+1)          | Negative (-1)             |
| ------------------------------ | ---------------------- | ------------------------- |
| `economic_left_right`          | Left (redistribution)  | Right (low tax)           |
| `state_vs_market`              | State control          | Market/privatisation      |
| `labour_rights`                | Strong unions          | Labour flexibility        |
| `law_order_vs_liberty`         | Civil liberties        | Law & order               |
| `global_vs_local`              | Globalist/free trade   | Protectionist/nationalist |
| `transformation_vs_continuity` | Radical transformation | Incremental reform        |

**Most questions are phrased so "Strongly agree" aligns with the positive axis direction:**

- Q1: "The government should raise taxes..." (left-wing framing) → agree = +1
- Q5: "Healthcare should be publicly funded..." (left-wing framing) → agree = +1

**Some questions are phrased from the opposing viewpoint** (`reverseScoring: true`):

- Q2: "Fiscal discipline and reducing public debt should be prioritised" (right-wing framing) → agree = -1 on axis (needs reversal)
- Q11: "Private companies should generate and sell electricity" (market framing) → agree = -1 on axis (needs reversal)
- Q19: "Labour market flexibility (easier hiring/firing) will increase investment" (anti-union framing) → agree = -1 on axis (needs reversal)
- Q43: "The apartheid-era legacy should be addressed through incremental reforms rather than sweeping systemic overhauls" (continuity framing) → agree = -1 on axis (needs reversal)

**When `reverseScoring: true`, the algorithm inverts the user's answer:**

```typescript
if (question.reverseScoring) {
  userValue = -userValue;
}
```

This ensures a communist answering "Strongly disagree" to "Labour flexibility will increase investment" correctly scores as +1 (pro-labour, aligned with left-wing axis), not -1.

Translation files contain all UI and question text. Locale switching persists to `localStorage` and resets the quiz.

## Testing

- Run tests with `npm run test` or `npm run test:ui`.
- Tests cover scoring logic, stores, router, i18n setup, and data validation.
- Vitest uses `happy-dom` environment.

## Tooling

- **TypeScript** – Full type coverage; build fails on type errors.
- **Linting** – `oxlint` + ESLint with autofix.
- **Bundler** – Rolldown-powered Vite for fast builds.
- **i18n** – Fallback locale is `en`; all locales must provide complete translations.

## Contributing

1. Fork + branch from `main`.
2. Keep lint, tests, and type checks green:
   ```sh
   npm run lint && npm run test && npm run build
   ```
3. When adding questions:
   - Add to **both** `en.json` and `af.json` translation files.
   - Add metadata to `questions.json` (with matching `id` and `textKey`).
   - Set `reverseScoring: true` if the question is phrased from the opposite axis direction (e.g., right-wing framing on left-wing axis).
   - Update `party_positions.json` if adding or modifying axis mappings.
   - Run tests to verify no type errors.

---

Have improvement ideas, new policy questions, or issues with party alignment? Open an issue or start a discussion so we can expand and refine Elekti.
