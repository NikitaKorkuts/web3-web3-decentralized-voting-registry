import {createAction} from '@reduxjs/toolkit';

export const SurveyActionTypes = {
  VOTE: 'SURVEYS/VOTE',
  DELETE: 'SURVEYS/DELETE'
};

export const vote = createAction<{surveyId: number, option: string, currentAccount: string}>(SurveyActionTypes.VOTE);
export const deleteSurveyById = createAction<{surveyId: number, currentAccount: string}>(SurveyActionTypes.DELETE);
