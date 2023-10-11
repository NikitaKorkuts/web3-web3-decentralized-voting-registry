import React from 'react';
import {Box, Modal, Typography} from '@mui/material';

import {style} from "./createSurveyModal.styles";
import "./createSurveyModal.css";
import {CreateSurveyForm} from '../CreateSurveyForm/CreateSurveyForm';

export const CreateSurveyModal = ({ handleClose, isOpen }) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        id="modal__box"
      >
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
        >
          Создание опроса
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          <CreateSurveyForm handleClose={handleClose} />
        </Typography>
      </Box>
    </Modal>
  );
};