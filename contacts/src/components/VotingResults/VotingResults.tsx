import React from 'react';
import {Box, Checkbox, Typography} from '@mui/material';

import { BorderLinearProgress } from './votingResults.styles'
import './votingResults.css'

export const VotingResults = ({ results, options,  totalVotes, userVote }) => {
  return (
    <div className='options' >
      {results.map((votes, i) => {
        const percentage = (votes / totalVotes) * 100;
        const isUserVote = i === Number(userVote);

        return (
          <div key={i}>
            <div className='stats' >
              <Typography
                sx={{marginTop: '5px'}}
                color="text.secondary"
              >
                {options[i]}
              </Typography>
              <div>
                <Typography
                  sx={{marginTop: '5px'}}
                  color="text.secondary"
                >
                  {votes + " Отв."}
                </Typography>
                <Typography
                  sx={{marginTop: '5px'}}
                  color="text.secondary"
                >
                  {percentage + " %"}
                </Typography>
              </div>
            </div>
            <div className='progress'>
              <Checkbox checked={isUserVote} disabled />
              <Box
                key={i}
                sx={{ flexGrow: 1 }}
              >

                <BorderLinearProgress variant="determinate" value={percentage} />
              </Box>
            </div>
          </div>
        )
      })}
    </div>

  );
}