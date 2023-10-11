import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import { contract } from '../web3/web3.sagas';
import {
  fetchSurveys,
  fetchSurveysSuccess,
  fetchSurveysFailure,
  createSurvey,
  createSurveyFailure, createSurveySuccess, getSurveyById, getSurveyByIdFailure, getSurveyByIdSuccess
} from './surveys.slice';
import {uploadImageIPFS} from '../../helper/uploadImageIPFS';
import {TActionPayload} from '../../types/types';
import {SurveyActionTypes} from './surveys.actions';

type TCreateSurveyPayload = {
  question: string;
  description: string;
  options: string[];
  tag: string[];
  currentAccount: string;
}

type TFetchSurveysPayload = {
  limit: number;
  page: number;
  tags: string[];
  currentAccount: string;
}

function* fetchSurveysWorker(action: TActionPayload<TFetchSurveysPayload>) {
  try {
    const { limit, page, tags, currentAccount } = action.payload;

    const surveys = yield contract.methods.getSurveys(limit, page, tags)
      .call({ from: currentAccount, gas: 99000000 });

    yield put(fetchSurveysSuccess(surveys));
  } catch (error) {
    yield put(fetchSurveysFailure(error.message));
  }
}

function* createSurveyWorker(action: TActionPayload<TCreateSurveyPayload>) {
  try {
    const { question, description, options, tags, currentAccount } = action.payload;

    //const fileUrl = yield call(uploadImageIPFS, imageFile);

    yield contract.methods.createSurvey(question, options, tags, description, '../../assets/images/2.jpg')
      .send({ from: currentAccount, gas: 1000000 });

    yield put(createSurveySuccess());
    const {limit, page, search} = yield select(state => state.surveys);

    yield put(fetchSurveys({limit, page, tags: search, currentAccount}))
  } catch (error) {
    yield put(createSurveyFailure(error.message));
  }
}

function* getSurveyByIdWorker(action: TActionPayload<{id: string, currentAccount: string}>) {
  try {
    const { id, currentAccount } = action.payload;

    const survey = yield contract.methods.getSurveyById(parseInt(id))
      .call({ from: currentAccount});

    const surveyObj = {
      id: survey[0],
      question: survey[1],
      description: survey[2],
      isActive: survey[3],
      options: survey[4],
      tags: survey[5],
      voteCounts: survey[6],
      creator: survey[7],
      imgURL: survey[8],
      hasVoted: survey[9],
      selectedOption: survey[10],
    };

    yield put(getSurveyByIdSuccess(surveyObj))
  } catch (error) {
    yield put(getSurveyByIdFailure(error.message));
  }
}

function* vote(action: TActionPayload<{surveyId: number, option: string, currentAccount: string}>) {
  try {
    const { option, surveyId, currentAccount } = action.payload;

    yield contract.methods.vote(surveyId, option)
      .send({ from: currentAccount, gas: 1000000 });

    yield put(getSurveyById({id: surveyId, currentAccount}));

  } catch (err) {
    console.error(err);
  }
}

function* deleteSurveyById(action: TActionPayload<{surveyId: number, option: string, currentAccount: string}>) {
  try {
    const { surveyId, currentAccount } = action.payload;

    yield contract.methods.deleteSurvey(surveyId)
      .send({ from: currentAccount, gas: 1000000 });

    const {limit, page, search} = yield select(state => state.surveys);

    yield put(fetchSurveys({limit, page, tags: search, currentAccount}))

  } catch (err) {
    console.error(err);
  }
}


function* watchFetchSurveys() {
  yield takeLatest(fetchSurveys.type, fetchSurveysWorker);
}

function* watchCreateSurvey() {
  yield takeLatest(createSurvey.type, createSurveyWorker);
}

function* watchGetSurveyById() {
  yield takeLatest(getSurveyById.type, getSurveyByIdWorker)
}

function* watchVote() {
  yield takeLatest(SurveyActionTypes.VOTE, vote);
}

function* watchDeleteSurveyById() {
  yield takeLatest(SurveyActionTypes.DELETE, deleteSurveyById);
}

export default function* surveySaga() {
  yield all([
    call(watchFetchSurveys),
    call(watchCreateSurvey),
    call(watchGetSurveyById),
    call(watchVote),
    call(watchDeleteSurveyById),
  ]);
}


