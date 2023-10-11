import React, {useState} from 'react'
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material';

import './surveyOptions.css';
import {useSelector} from 'react-redux';

export const SurveyOptions = ({ handleVote }) => {
  const [value, setValue] = useState<string | null>(null);
  const { currentSurvey } = useSelector(store => store.surveys);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <div className='surveyOptions' >
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">{currentSurvey?.question}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          {currentSurvey?.options.map(option => {
            return (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            )
          })}
        </RadioGroup>
      </FormControl>
      <Button
        color='error'
        variant='contained'
        onClick={() => handleVote(value)}
      >
        Проголосовать
      </Button>
    </div>
  );
};

