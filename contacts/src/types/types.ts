export type TActionPayload<T> = {
  type: string;
  payload: T;
}

export type TSurvey = {
  id: string;
  creator: string;
  question: string;
  options: string[];
  voteCounts: number[];
  tags: string[];
  isActive: boolean;
  hasVoted: boolean;
  description: string;
  imgURL: string;
  selectedOption: number;
}

export type TNullable<T> = T | null | undefined