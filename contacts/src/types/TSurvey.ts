export type TSurvey = {
  id: number;
  question: string;
  options: string[];
  voteCounts: string[];
}

export type TGetSurveysPayload = {
  question: string;
  options: string[];
  tags: string[];
}