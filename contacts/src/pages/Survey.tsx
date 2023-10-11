import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {Typography} from '@mui/material';

import { getSurveyById } from '../store/surveys/surveys.slice';
import { SurveyOptions } from '../components/SurveyOptions/SurveyOptions';
import { vote } from '../store/surveys/surveys.actions';
import { VotingResults } from '../components/VotingResults/votingResults';

const Survey = () => {
  const { currentAccount, isContractInit } = useSelector(store => store.web3);
  const { currentSurvey } = useSelector(store => store.surveys);
  const dispatch = useDispatch();
  const { id }= useParams();

  useEffect(() => {
    if (isContractInit && currentAccount) {
      dispatch(getSurveyById({ id, currentAccount }));
    }
  }, [isContractInit, dispatch, currentAccount, id])

  const handleVote = (option: string) => {
    dispatch(vote({ surveyId: currentSurvey.id , option, currentAccount}));
  }

  let totalCount = 0;
  if (currentSurvey?.voteCounts) {
    totalCount = Number(currentSurvey.voteCounts.reduce((acc, num) => acc + num, 0n));
  }

  if (currentSurvey) {
    return (
      <div>
        <Typography>
          {currentSurvey?.description}
        </Typography>
        {currentSurvey.isActive === false && (
          <Typography
            sx={{marginTop: '5px'}}
            color="text.secondary"
          >
            Голосование окончено.
          </Typography>
        )}
        {currentSurvey.hasVoted && (
          <Typography
            sx={{marginTop: '5px'}}
            color="text.secondary"
          >
            Вы уже проголосовали в этом голосовании.
          </Typography>
        )}
        {currentSurvey.isActive && !currentSurvey.hasVoted && <SurveyOptions handleVote={handleVote} />}
        {!currentSurvey.isActive || currentSurvey.hasVoted && (
          <VotingResults
            results={currentSurvey.voteCounts.map(v => Number(v))}
            options={currentSurvey.options}
            totalVotes={totalCount}
            userVote={currentSurvey.selectedOption}
          />)}
        <Typography
          sx={{marginTop: '5px'}}
          color="text.secondary"
        >
          Количество голосов: {totalCount}
        </Typography>
      </div>
    )
  }

  return (
    <Typography
      sx={{marginTop: '5px'}}
      color="text.secondary"
    >
      Не удалось найти голосование.
    </Typography>
  )
};

export default Survey;