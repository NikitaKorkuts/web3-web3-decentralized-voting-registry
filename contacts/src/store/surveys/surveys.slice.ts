import { createSlice } from '@reduxjs/toolkit';
import {TActionPayload, TNullable, TSurvey} from '../../types/types';

type TSurveyInitialState = {
  currentSurvey: TSurvey | null;
  totalCount: number;
  surveys: TSurvey[];
  limit: number;
  page: number;
  search: string[];
  fetchSurveys: {
    loading: boolean;
    error: TNullable<string>;
  };
  createSurvey: {
    loading: boolean;
    error: TNullable<string>;
  },
  getSurveyById: {
    loading: boolean,
    error: TNullable<string>;
  }
}

const initialState: TSurveyInitialState = {
  currentSurvey: null,
  totalCount: 0,
  surveys: [],
  limit: 4,
  page: 1,
  search: [],
  fetchSurveys: {
    loading: false,
    error: null,
  },
  createSurvey: {
    loading: false,
    error: null,
  },
  getSurveyById: {
    loading: false,
    error: null,
  }
}

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    fetchSurveys: (state) => {
      state.fetchSurveys.loading = true;
      state.fetchSurveys.error = null;
    },
    fetchSurveysSuccess: (state, action: TActionPayload<{totalCount: bigint, surveys: TSurvey[]}>) => {
      state.surveys = action.payload.surveys;
      state.totalCount = Number(action.payload.totalCount);
      state.fetchSurveys.loading = false;
    },
    fetchSurveysFailure: (state, action: TActionPayload<string>) => {
      state.fetchSurveys.error = action.payload;
      state.fetchSurveys.loading = false;
    },
    createSurvey: (state) => {
      state.createSurvey.loading = true;
      state.createSurvey.error = null;
    },
    createSurveySuccess: (state) => {
      state.createSurvey.loading = false;
    },
    createSurveyFailure: (state, action: TActionPayload<string>) => {
      state.createSurvey.error = action.payload;
      state.createSurvey.loading = false;
    },
    getSurveyById: (state) => {
      state.getSurveyById.loading = true;
      state.getSurveyById.error = null;
    },
    getSurveyByIdSuccess: (state, action: TActionPayload<TSurvey>) => {
      state.currentSurvey = action.payload;
      state.getSurveyById.loading = false;
    },
    getSurveyByIdFailure: (state, action: TActionPayload<string>) => {
      state.getSurveyById.error = action.payload;
      state.getSurveyById.loading = false;
    },
    setPage: (state, action: TActionPayload<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: TActionPayload<number>) => {
      state.limit = action.payload;
    },
    setSearch: (state, action: TActionPayload<string[]>) => {
      state.search = action.payload;
    }
  },
});

export const {
  fetchSurveys,
  fetchSurveysSuccess,
  fetchSurveysFailure,
  createSurvey,
  createSurveySuccess,
  createSurveyFailure,
  getSurveyById,
  getSurveyByIdSuccess,
  getSurveyByIdFailure,
  setPage,
  setLimit,
  setSearch,
} = surveySlice.actions;

export default surveySlice.reducer;