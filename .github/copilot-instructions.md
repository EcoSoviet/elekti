# Elekti - AI Development Guide

## Project Overview

Elekti is a political quiz/matching application built with Vue 3, TypeScript, and Vite. Users answer questions about their political views and are matched with South African political parties based on a weighted scoring algorithm.

## Architecture

### Data Flow & Core Components

1. **Question Loading**: Questions dynamically load from i18n translations (`src/data/translations/*.json`) based on selected locale
2. **State Management**: Two Pinia stores handle app state:
   - `quizStore` - quiz logic, answers, navigation, scoring computation
   - `uiStore` - UI state (language selection, persists to localStorage)
3. **Scoring Algorithm**: `src/utils/scoring.ts` computes party matches using `src/data/scoring.json` which maps question IDs → party scores per option
4. **Router Structure**: Simple 4-page SPA (Landing → Quiz → Results, with About page)

### Key Patterns

**i18n Integration**: Questions are NOT in `questions.json` - they're in translation files under `questions.q1`, `questions.q2`, etc. Each question has `text` and `category` fields. When locale changes, `quizStore` reloads questions via `loadQuestionsFromI18n()`.

**Party ID Mapping**: `scoring.json` uses display names (e.g., "ANC", "VF+"), but `parties.json` uses kebab-case IDs (e.g., "anc", "vfplus"). The `mapPartyKey()` function in `scoring.ts` handles this mapping. When adding parties, update both the mapping function and party data.

**Answer State**: Answers stored as `Record<string, number>` where keys are question IDs ("q1", "q2") and values are option indices (0-4 for Strongly Agree → Strongly Disagree). URL encoding uses comma-separated string of indices.

## Development Workflows

### Essential Commands

- `npm run dev` - Start dev server (uses Vite/Rolldown)
- `npm run test` - Run Vitest unit tests
- `npm run test:ui` - Launch Vitest UI
- `npm run lint` - Run oxlint then eslint (order matters, defined in `lint:*` scripts)
- `npm run build` - Type-check with vue-tsc, then build

### Testing Conventions

- Store tests mock i18n with sample question data (see `quizStore.test.ts`)
- Use `beforeEach(() => setActivePinia(createPinia()))` for Pinia stores
- Scoring tests use `mockParties` array with minimal party data
- Tests run in happy-dom environment (configured in `vitest.config.ts`)

### Linting & Formatting

- **Dual linting**: oxlint runs first for correctness, then eslint for style
- ESLint ignores JSON files except via `@eslint/json` plugin
- `vue/multi-word-component-names` is disabled (allows single-word components like Quiz.vue)
- Prettier with organize-imports plugin - run via `npm run format`

## Adding Features

### Adding Questions

1. Add question to ALL translation files under `questions.qN` with `text` and `category`
2. Add question ID to `questionIds` array in `quizStore.ts` (must be sequential)
3. Add scoring data to `scoring.json` with party scores for each option (0.0-0.9 scale)

### Adding Parties

1. Add party to `src/data/parties.json` with kebab-case `id`
2. Update `mapPartyKey()` in `scoring.ts` with display name → ID mapping
3. Add party scores to every question in `scoring.json`
4. Add party description to all translation files under `party.{id}.desc`

### Adding Locales

1. Create `src/data/translations/{code}.json` with ALL translation keys
2. Import in `src/i18n.ts` and add to messages object
3. Add locale to `availableLocales` array with code and native name
4. Update locale type in `uiStore.ts` if using strict typing

## Technical Details

### Build Configuration

- Uses `rolldown-vite` (Vite powered by Rolldown) for faster builds
- Manual chunk splitting for Vue, Vue Router, Pinia, and vue-i18n (see `vite.config.ts`)
- Fontaine plugin generates font metrics for FOUT reduction
- `@` alias resolves to `./src`

### Style System

- CSS custom properties in `src/styles/theme.css` (e.g., `--color-primary`, `--space-lg`)
- No CSS framework - custom utility classes
- Consistent spacing scale: `--space-{xs,sm,md,lg,xl}`

### Component Communication

- Vue 3 Composition API with `<script setup>`
- Props + emit pattern for parent-child communication (see `QuizQuestion.vue`)
- i18n via `useI18n()` composable, accessed in templates as `$t('key')`

### Deployment Considerations

- Node 22.21.1+ required (see `engines` in package.json)
- Vue Devtools plugin enabled in dev mode only
- Results can be encoded in URL for sharing (`quizStore.encodeAnswersToUrl()`)
