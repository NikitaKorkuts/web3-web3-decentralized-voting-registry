export type TCreateSurveyForm = {
  question: string;
  description?: string;
  tags: string[];
  options: { id: string, text: string }[];
};

export type OptionType = {
  id: string;
  text: string;
};