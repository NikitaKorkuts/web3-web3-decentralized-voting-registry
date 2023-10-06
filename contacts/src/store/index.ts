import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects'
import { configureStore } from '@reduxjs/toolkit'
import { surveysReducer } from './surveys/surveys.slice';
import web3Reducer from './web3/web3.slice';
import watchInitWeb3Saga from './web3/web3.sagas';

const sagaMiddleware = createSagaMiddleware();

export default function* rootSaga() {
  yield all([
    watchInitWeb3Saga()
  ])
}

export const store = configureStore({
  devTools: true,
  reducer: {
    surveys: surveysReducer,
    web3: web3Reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);