import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {fetchSurveys, setLimit, setPage, setSearch} from '../store/surveys/surveys.slice';
import {CreateSurveyButton} from '../components/CreateSurveyButton/CreateSurveyButton';
import {CreateSurveyModal} from '../components/CreateSurveyModal/CreateSurveyModal';
import {Grid} from '@mui/material';
import {SurveyCard} from '../components/SurveyCard/SurveyCard';
import {Link, useSearchParams} from 'react-router-dom';
import {SurveysPagination} from '../components/SurveysPagination/SurveysPagination';

const SurveysList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { surveys, error } = useSelector((state) => state.surveys);
  const { isContractInit, currentAccount } = useSelector((state) => state.web3);
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit') || 4);
  const search = searchParams.get('search') ? searchParams.get('search').split(' ') : [];

  useEffect(() => {
    if (isContractInit && dispatch && currentAccount && limit && page && search) {
      dispatch(setPage(page));
      dispatch(setLimit(limit));
      dispatch(setSearch(search));

      debugger

      dispatch(fetchSurveys({ limit, page, tags: search, currentAccount }));
    }
  }, [dispatch, isContractInit, currentAccount, limit, page, searchParams]);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="surveysList" >
      <SurveysPagination />
      <Grid
        container
        spacing={4}
      >
          { error && (
            <p style={{marginTop: '50px'}} >Ошибка при запросе опросов.</p>
          )}
          { surveys && surveys.length ? surveys.map((survey) => {
            return (
              <Grid
                item
                xs={12}
                md={6}
                key={survey.id
              }>
                <Link
                  to={`survey/${survey.id}`}
                  style={{textDecoration: 'none'}}
                >
                  <SurveyCard currentAccount={currentAccount} {...survey} />
                </Link>
              </ Grid>
            )
          }): (
            <p style={{marginTop: '50px'}} >Опросов нет.</p>
          )}

      </Grid>

      <CreateSurveyButton handleClick={handleModalOpen} />
      <CreateSurveyModal handleClose={handleModalClose} isOpen={isModalOpen} />
    </div>
  );
};

export default SurveysList;