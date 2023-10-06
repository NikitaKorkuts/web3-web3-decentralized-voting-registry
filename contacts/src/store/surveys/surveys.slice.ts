import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TGetSurveysPayload, TSurvey} from '../../types/TSurvey';


type TSurveysState = {
  surveys: TSurvey[] | null;
}

const initialState: TSurveysState = {
  surveys: null,
}

export function* getPostsSaga(): any {
  const payload = yield getPostsApi().then((response) => response.json());

  yield put(getPostsSuccess(payload));
}

export const githubSlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    getSurveys(state, action: PayloadAction<TGetSurveysPayload>) {

    }
  }
})

export const surveysActions = githubSlice.actions
export const surveysReducer = githubSlice.reducer