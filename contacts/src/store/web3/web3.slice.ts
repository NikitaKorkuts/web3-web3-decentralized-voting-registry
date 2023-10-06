import {createSlice} from "@reduxjs/toolkit";

const web3Slice = createSlice({
  name: 'web3',
  initialState: {
    web3Instance: null,
    accounts: [],
    currentAccount: null
  },
  reducers: {
    setWeb3Instance: (state, action) => {
      state.web3Instance = action.payload;
    },
    setAccounts: (state, action) => {

      state.accounts = action.payload;
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    }
  }
});

export const {
  setWeb3Instance,
  setAccounts,
  setContract,
  setCurrentAccount
} = web3Slice.actions;

export default web3Slice.reducer;