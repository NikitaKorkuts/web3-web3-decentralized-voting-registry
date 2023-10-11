import { Routes, Route } from 'react-router-dom'
import React, {Suspense, useEffect} from 'react';
import './assets/styles/globals.css';
import {useDispatch} from 'react-redux';
import {initWeb3} from './store/web3/web3.actions';
import {Layout} from './components/Layout/Layout';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initWeb3());
  }, [dispatch]);

  const SurveysListPage = React.lazy(() => import('./pages/SurveysList'));
  const SurveyPage = React.lazy(() => import('./pages/Survey'));

  return (
    <Layout>
      <Suspense fallback="loading..." >
        <Routes>
          <Route path={'/'} element={<SurveysListPage />} />
          <Route path={'survey/:id'} element={<SurveyPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App;
