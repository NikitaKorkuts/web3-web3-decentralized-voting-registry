import React from 'react';
import {useSelector} from 'react-redux';

const SurveysList = () => {

  const currentAccount = useSelector((state) => state.web3.currentAccount);
  return (
    <div>
      {currentAccount}
    </div>
  );
};

export default SurveysList;