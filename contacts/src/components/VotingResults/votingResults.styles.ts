import {LinearProgress, linearProgressClasses} from '@mui/material';
import styled from '@emotion/styled';

export const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
  margin: '10px 0',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#eee',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}));