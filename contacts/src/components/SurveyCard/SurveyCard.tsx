import React from 'react';
import {Card, CardMedia, CardActionArea, CardContent, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import {TSurvey} from '../../types/types';
import image from '../../assets/images/2.jpg';
import {useDispatch} from 'react-redux';
import {deleteSurveyById} from '../../store/surveys/surveys.actions';

import './surveyCard.css';

export const SurveyCard: React.FC<TSurvey> = ( {
     id,
     question,
     description,
     voteCounts,
     currentAccount,
     creator
} ) => {
  const dispatch = useDispatch();


  const handleDelete = (e) => {
    console.log(creator, currentAccount)
    e.preventDefault()
    dispatch(deleteSurveyById({surveyId: id, currentAccount}))
  }

  return (
    <Card style={{position: 'relative'}}>

      {creator === currentAccount && (
        <DeleteIcon
            className='deleteIcon'
            onClick={(e) => handleDelete(e)}
        >
        </DeleteIcon>
      )}
      <CardActionArea>
        <CardMedia
          component='img'
          height='140'
          image={image}
          alt='Картинка опроса'
        />

        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
          >
            {question}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description && description.slice(0, 280) + '...'}
          </Typography>
          <Typography
            sx={{marginTop: '5px'}}
            color="text.secondary"
          >
            Количество голосов: {Number(voteCounts.reduce((acc, num) => acc + num, 0n)) || 0}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

