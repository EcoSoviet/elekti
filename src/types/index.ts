export interface Party {
  id: string;
  name: string;
  nameKey?: string;
  short: string;
  descriptionKey: string;
  ideologyKey: string;
  colour: string;
  logo?: string;
  website: string;
}

export interface Question {
  id: string;
  text: string;
  textKey?: string;
  axis: string;
  weight: number;
  options: Array<{ value: number; label: string }>;
}

export interface QuestionMetadata {
  id: string;
  textKey: string;
  axis: string;
  weight: number;
  direction?: "positive" | "negative";
}

export interface Axis {
  id: string;
  name: string;
  shortNameKey: string;
  description: string;
}

export interface PartyScore {
  partyId: string;
  alignmentScore: number;
  party: Party;
  axisScores?: Record<string, number>;
}

export interface AxisContribution {
  axisId: string;
  score: number;
  weight: number;
}

export interface AxisCoverage {
  axisId: string;
  questionsAnswered: number;
  totalQuestions: number;
}

export interface QuizResult {
  primary: PartyScore;
  alternatives: PartyScore[];
  allScores: PartyScore[];
  confidence: "high" | "medium" | "low";
  timestamp: number;
  topAxes?: AxisContribution[];
  answeredAxes?: AxisCoverage[];
}
