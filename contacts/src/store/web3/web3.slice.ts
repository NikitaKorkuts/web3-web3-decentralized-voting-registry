import {createSlice} from "@reduxjs/toolkit";

const web3Slice = createSlice({
  name: 'web3',
  initialState: {
    accounts: [],
    currentAccount: null,
    isContractInit: false,
  },
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setIsContractInit: (state, action) => {
      state.isContractInit = action.payload;
    }
  }
});

export const {
  setAccounts,
  setCurrentAccount,
  setIsContractInit
} = web3Slice.actions;

export default web3Slice.reducer;