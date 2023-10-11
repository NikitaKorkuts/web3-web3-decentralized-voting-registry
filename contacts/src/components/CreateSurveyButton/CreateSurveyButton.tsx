import React from 'react';
import {Fab} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import './createSurveyButton.css';

export const CreateSurveyButton = ({ handleClick }) => {
  return (
    <div className="wrapper" >
      <Fab
        onClick={handleClick}
        size="large"
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </div>
  );
};
