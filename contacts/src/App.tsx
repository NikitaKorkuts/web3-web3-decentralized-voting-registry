import { Routes, Route } from 'react-router-dom'
import React, {Suspense} from 'react';
import './assets/styles/globals.css';

function App() {

  const SurveysListPage = React.lazy(() => import('./pages/SurveysList'));
  const SurveyPage = React.lazy(() => import('./pages/Survey'));

  return (
    <>
      <Suspense fallback="loading..." >
        <Routes>
          <Route path={'/'} element={<SurveysListPage />} />
          <Route path={'survey'} element={<SurveyPage />} />
        </Routes>
      </Suspense>


    </>
  )
}

export default App;
