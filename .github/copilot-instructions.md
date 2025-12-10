# Copilot Instructions for Elekti

## Project Overview

- **Elekti** is a Vue 3 + Pinia SPA for matching South African voters to parties via a weighted, axis-based scoring system.
- All quiz content and UI text are strictly localized (English/Afrikaans) and managed via translation files.
- Scoring is deterministic, axis-based, and normalized per party; results are shareable via URL encoding.

## Architecture & Key Files

- Views: Route-level components in `src/views/` (Landing, Quiz, Results, About)
- State Management: Pinia stores in `src/stores/` (`quizStore`, `uiStore`)
- Data:
  - `src/data/questions.json`: Question metadata (id, axis, weight, textKey) for 50 questions
  - `src/data/axes.json`: 12 axes definitions
  - `src/data/parties.json`: Party metadata
  - `src/data/party_positions.json`: Party stances per axis (12 parties × 12 axes)
  - `src/data/translations/{en,af}.json`: Localized UI and question text
- Scoring: `src/utils/scoring.ts` (core logic), tested in `scoring.test.ts`
- Constants: `src/utils/constants.ts` defines `STANDARD_OPTIONS` (answer values -1 to +1)
- Components: Quiz UI in `src/components/` (QuizQuestion, PartyCard, etc.)

## Developer Workflows

- Install & Run:
  - `npm install`
  - `npm run dev` (local server at http://localhost:5173)
- Build: `npm run build` (type errors fail build)
- Test: `npm run test` (Vitest, happy-dom)
- Lint/Format: `npm run lint` (oxlint + ESLint), `npm run format` (Prettier)
- Preview: `npm run preview` (production build)

## Content & Localization

- Add Question:
  1. Add to both `en.json` and `af.json` under `questions`
  2. Add metadata to `questions.json` (id, textKey, axis, weight)
  3. Update `party_positions.json` for all 12 parties on the axis
  4. Run tests to verify
- Remove/Modify Question: Update translation files and `questions.json`; keep question `id` stable
- Localization: All UI and quiz text must exist in both translation files. Locale switching uses `uiStore.setLang()` and persists to localStorage

## Patterns & Conventions

- TypeScript strictness: All code must pass type checks; build fails otherwise
- Pinia: Centralised state, hydrated in `main.ts`
- vue-i18n: Fallback locale is `en`; all keys must be present in new locales
- Scoring: Axis-based, not direct text matching. See `scoring.ts` for algorithm
- Reverse Scoring: Questions may be phrased from different political viewpoints. Use `reverseScoring: true` in `questions.json` when a question's framing opposes the axis direction (e.g., right-wing phrasing on a left-wing axis)
- Axis Direction: Each axis has a defined positive (+1) and negative (-1) direction. Most questions are phrased so "Strongly agree" = +1 direction. Questions with `reverseScoring: true` invert the user's answer value before scoring
- Tests: Stores and scoring logic are unit tested; use fixtures/mocks for i18n and data
- Comments: Do not add comments to code unless specifically requested
- Language: Use British English spelling and grammar throughout code and documentation

## Answer Options & Numeric Values

User answers map to numeric values via `STANDARD_OPTIONS` in `src/utils/constants.ts`:

| Option            | Value |
| ----------------- | ----- |
| Strongly Agree    | +1.0  |
| Agree             | +0.5  |
| Neutral           | 0.0   |
| Disagree          | -0.5  |
| Strongly Disagree | -1.0  |

These values are compared against party positions (also in the -1 to +1 range) after reverse scoring is applied. The scoring algorithm calculates similarity as `1 - abs(userValue - partyPosition)`, so identical positions yield 1.0 (perfect match) and maximally opposite positions yield 0.0 (no match).

## Parties Included

The quiz includes 12 South African political parties:

1. ANC - African National Congress (centre-left, governing party)
2. DA - Democratic Alliance (centre-right, liberal)
3. EFF - Economic Freedom Fighters (far-left, radical)
4. IFP - Inkatha Freedom Party (centre, Zulu-focused, conservative)
5. MK - uMkhonto we Sizwe Party (left, Zuma-led)
6. PA - Patriotic Alliance (right, nationalist)
7. VF+ - Freedom Front Plus (right, Afrikaner-focused, conservative)
8. ActionSA - ActionSA (centre-right, anti-corruption)
9. ACDP - African Christian Democratic Party (centre-right, Christian conservative)
10. UFC - Unite for Change (centrist)
11. UDM - United Democratic Movement (centre-left, pro-institution)
12. SACP - South African Communist Party (far-left, socialist)

All party metadata (names, descriptions, colours) are in `src/data/parties.json`. Party positions on all 12 axes are in `src/data/party_positions.json`.

## Scoring & Question Directionality

### Axis Directions

Each axis has a defined positive and negative direction:

| Axis ID                        | Positive (+1)                     | Negative (-1)                   |
| ------------------------------ | --------------------------------- | ------------------------------- |
| `economic_left_right`          | Left (redistribution, high tax)   | Right (low tax, market-led)     |
| `state_vs_market`              | State control, public ownership   | Market/privatisation            |
| `land_and_ownership`           | Expropriation, communal rights    | Private property rights         |
| `labour_rights`                | Strong unions, worker protection  | Labour flexibility              |
| `law_order_vs_liberty`         | Civil liberties, protest rights   | Law & order, policing           |
| `democratic_institutions`      | Strong oversight, anti-corruption | Executive flexibility           |
| `environment_energy`           | Climate action, green transition  | Pragmatic energy mix            |
| `social_progressivism`         | LGBTQ+ rights, gender equality    | Traditional/conservative values |
| `global_vs_local`              | Free trade, open borders          | Protectionist, nationalist      |
| `transformation_vs_continuity` | Radical transformation            | Incremental reform              |
| `urban_development`            | Public transit, dense walkability | Car-friendly, sprawl            |
| `equity_and_inclusion`         | Strong BEE/affirmative action     | Meritocratic/colour-blind       |

### Question Phrasing & Reverse Scoring

Questions can be phrased from two perspectives:

1. **Direct phrasing** (`reverseScoring: false` or omitted)
   - Question statement aligns with the positive axis direction
   - "Strongly agree" (user value +1) maps to +1 on the axis
   - Example: Q1 "The government should raise taxes..." (left-wing framing)
   - User: Strongly agree (+1) → Aligns with economic_left_right +1 direction

2. **Reverse phrasing** (`reverseScoring: true`)
   - Question statement aligns with the negative axis direction
   - User's answer must be inverted before scoring
   - Example: Q11 "Private companies should generate electricity..." (market framing on state_vs_market axis)
   - User: Strongly agree (value +1) → Inverted to -1 → Aligns with market position
   - Example: Q19 "Labour flexibility will increase investment..." (anti-union framing on labour_rights axis)
   - User: Strongly disagree (value -1) → Inverted to +1 → Aligns with pro-labour position

### Questions with Reverse Scoring (Current List)

- **q2**: "Fiscal discipline and reducing public debt should be prioritised" (right-wing framing on economic_left_right)
- **q9**: "Government should support SMEs with tax breaks and deregulation" (market framing on state_vs_market)
- **q11**: "Private companies should generate and sell electricity" (market framing on state_vs_market)
- **q19**: "Labour market flexibility (easier hiring/firing) will increase investment" (anti-union framing on labour_rights)
- **q22**: "Freedom of expression and protest should be prioritised" (liberty framing on law_order_vs_liberty)
- **q23**: "South Africa should adopt strong digital privacy laws" (liberty framing on law_order_vs_liberty)
- **q38**: "Trade policy should protect local industries through tariffs" (protectionist framing on global_vs_local)
- **q39**: "South Africa should adopt stricter immigration policies" (protectionist framing on global_vs_local)
- **q40**: "Regulate employment of undocumented foreign nationals" (protectionist framing on global_vs_local)
- **q43**: "Apartheid legacy addressed through incremental reforms rather than systemic overhauls" (continuity framing on transformation_vs_continuity)

### Validating Party Positions

When reviewing or adjusting party positions in `party_positions.json`, think about **how someone aligned with that party would answer the questions on each axis**:

1. Read all questions for a given axis (check `questions.json` to find which questions map to which axis)
2. For each question, consider: Would a typical supporter of this party agree or disagree?
3. Factor in `reverseScoring` – if `true`, disagreement moves the party toward the positive axis direction
4. The party's position should reflect the average stance across all questions on that axis

Example: ANC on `democratic_institutions` axis

Questions include:

- q25: "Local government should be professionally staffed... even if this limits political appointments" (reverseScoring: false)
- q27: "Corruption prosecutions should be fast and aggressive" (reverseScoring: false)
- q30: "Leaders who undermine judiciary should face consequences" (reverseScoring: false)

ANC's actual behaviour: Cadre deployment, slow/selective prosecutions, limited consequences for institutional undermining.

Analysis:

- ANC supporters would likely disagree with these pro-institution questions
- Since reverseScoring is false on all these questions, disagreement = negative values on the axis
- Conclusion: Position should be negative (around -0.3), not positive

### Adding New Questions

When adding a question, determine its axis and phrasing direction:

1. **Decide the axis** – Choose from the 12 defined axes above
2. **Decide the framing** – Will "Strongly agree" align with the positive (+1) or negative (-1) direction of the axis?
3. **Set reverseScoring accordingly**:
   - Positive direction framing → `"reverseScoring": false` (or omit)
   - Negative direction framing → `"reverseScoring": true`

Example: Adding a question about renewable energy transition

- Axis: `environment_energy` (positive = climate action, negative = pragmatic energy)
- Question: "South Africa should rapidly transition to 100% renewable energy" (climate action framing)
- Answer: Agreeing = +1 direction → `"reverseScoring": false`

Example: Adding a question about business deregulation

- Axis: `state_vs_market` (positive = state control, negative = market/private)
- Question: "Businesses should face lighter regulatory burdens to boost competitiveness" (market framing)
- Answer: Agreeing = -1 direction → `"reverseScoring": true`
