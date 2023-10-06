import {createAction} from '@reduxjs/toolkit';

export const ActionTypes = {
  INIT_WEB3: 'WEB3/INIT_WEB3',
};

export const initWeb3 = createAction(ActionTypes.INIT_WEB3);
