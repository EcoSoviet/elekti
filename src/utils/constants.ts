export const STANDARD_OPTIONS = [
  { value: 1, label: "Strongly agree" },
  { value: 0.5, label: "Agree" },
  { value: 0, label: "Neutral" },
  { value: -0.5, label: "Disagree" },
  { value: -1, label: "Strongly disagree" },
];

export const TIMING = {
  ANSWER_DELAY: 300,
  TRANSITION_RESET: 50,
  TRANSITION_DURATION: 300,
} as const;

export const URL_PARAMS = {
  MAX_URL_LENGTH: 2000,
  RESULTS: "r",
  MODE: "m",
  QUESTIONS: "q",
} as const;

export const SCORING = {
  LOW_CONFIDENCE_THRESHOLD: 0.2,
  MEDIUM_CONFIDENCE_THRESHOLD: 0.5,
  SPREAD_THRESHOLD: 0.1,
} as const;

export const AXIS_COLOR_THRESHOLDS = {
  STRONG: { percentage: 75, color: "#1f7a51" },
  MODERATE: { percentage: 50, color: "#b58a1a" },
  WEAK: { percentage: 25, color: "#8f2d1f" },
  NONE: { color: "#6a5b50" },
} as const;
