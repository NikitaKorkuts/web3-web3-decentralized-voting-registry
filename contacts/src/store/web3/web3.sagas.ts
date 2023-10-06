import { call, put, takeLatest, fork, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {Web3} from 'web3';
import {ActionTypes} from './web3.actions';
import { setAccounts, setCurrentAccount } from './web3.slice';
import SurveyRegistry from '../../../../contracts/build/contracts/Contacts.json';

let web3;
let contract;

function createEthereumChannel(ethereum) {
  return eventChannel(emit => {
    ethereum.on('accountsChanged', accounts => {
      console.log('Accounts changed', accounts);
      emit(accounts);
    });

// The subscriber must return an unsubscribe function
    return () => {
      ethereum.removeAllListeners('accountsChanged');
    };
  });
}

function* watchOnAccountsChanged(ethereum) {
  const channel = yield call(createEthereumChannel, ethereum);
  while (true) {
    const accounts = yield take(channel);
    console.log('Accounts from event channel', accounts);
    yield put(setCurrentAccount(accounts[0]));
  }
}

export function* initWeb3Saga() {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum as string);
      yield window.ethereum.enable();

      yield fork(watchOnAccountsChanged, window.ethereum);
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider as string);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      web3 = new Web3('http://localhost:7545');
    }

    const accounts = yield web3.eth.getAccounts();
    console.log('Accounts from getAccounts', accounts);
    yield put(setAccounts(accounts));
    yield put(setCurrentAccount(accounts[0]));

    const networkId = yield web3.eth.net.getId();
    const deployedNetwork = SurveyRegistry.networks[networkId];
    contract = new web3.eth.Contract(
      SurveyRegistry.abi,
      deployedNetwork && deployedNetwork.address,
    );
  } catch (error) {
    console.error('Saga error', error);
  }
}

export default function* watchInitWeb3Saga() {
  yield takeLatest(ActionTypes.INIT_WEB3, initWeb3Saga);
}

export { web3, contract };