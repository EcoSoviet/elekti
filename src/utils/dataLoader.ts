import axesData from "../data/axes.json";
import partiesData from "../data/parties.json";
import partyPositionsData from "../data/party_positions.json";
import questionsData from "../data/questions.json";
import type { Axis, Party, QuestionMetadata } from "../types";

let cachedAxes: Axis[] | undefined;
let cachedParties: Party[] | undefined;
let cachedQuestions: QuestionMetadata[] | undefined;
let cachedPartyPositions: Record<string, Record<string, number>> | undefined;

export function getAxes(): Axis[] {
  if (cachedAxes) {
    return cachedAxes;
  }
  cachedAxes = (axesData as { axes: Axis[] }).axes;
  return cachedAxes;
}

export function getParties(): Party[] {
  if (cachedParties) {
    return cachedParties;
  }
  const parties = (partiesData as Party[]).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );
  cachedParties = parties;
  return cachedParties;
}

export function getQuestions(): QuestionMetadata[] {
  if (cachedQuestions) {
    return cachedQuestions;
  }
  cachedQuestions = (questionsData as { questions: QuestionMetadata[] })
    .questions;
  return cachedQuestions;
}

export function getPartyPositions(): Record<string, Record<string, number>> {
  if (cachedPartyPositions) {
    return cachedPartyPositions;
  }
  cachedPartyPositions = (
    partyPositionsData as { parties: Record<string, Record<string, number>> }
  ).parties;
  return cachedPartyPositions;
}

export function clearDataCaches(): void {
  cachedAxes = undefined;
  cachedParties = undefined;
  cachedQuestions = undefined;
  cachedPartyPositions = undefined;
}
