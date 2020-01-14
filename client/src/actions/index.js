import getWeb3 from 'utils/getWeb3';
import { Ocean } from '@oceanprotocol/squid';
import { aquariusUri, brizoUri, brizoAddress, nodeUri, secretStoreUri } from 'config';
import firebase from 'utils/configFireBase';

export const WEB3_CONNECT = 'WEB3_CONNECT';
export const web3Connect = () => async (dispatch) => {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  const config = {
    web3Provider: web3,
    nodeUri,
    aquariusUri,
    brizoUri,
    brizoAddress,
    secretStoreUri,
    verbose: true
  };
  const ocean = await Ocean.getInstance(config);
  if (web3.currentProvider.networkVersion !== '8995') {
    // alert('Unknown network, please change network to Pacific network');
    alert('Unknown network, please change network to Nile Testnet network');
    return;
  }
  if (accounts.length > 0) {
    const account = accounts[0];
    dispatch({
      type: WEB3_CONNECT,
      web3,
      account,
      ocean
    });
  } else {
    console.log('Account not found');
  }
};

export const FETCH_ASSETS = 'FETCH_ASSETS';
export const fetchAsset = () => async (dispatch, getState) => {
  const state = getState();
  const ocean = state.ocean;
  const searchQuery = {
    offset: 30,
    page: 1,
    query: {
      categories: ['Biology']
    },
    sort: {
      created: -1
    }
  };
  try {
    const search = await ocean.assets.query(searchQuery);
    dispatch({
      type: FETCH_ASSETS,
      allAssets: search.results
    });
  } catch (e) {
    console.log(e);
  }
};

export const INSERT_DID_TO_USER = 'INSERT_DID_TO_USER';
export const insertDidToUser = (address, ddo) => async (dispatch) => {
  firebase
    .database()
    .ref('users/' + address + '/' + ddo.id)
    .set(ddo, function(error) {
      if (error) {
        console.log(error);
      } else {
        dispatch({
          type: GET_MY_ASSETS
        });
      }
    });
};

export const INSERT_LABELED_DATA = 'INSERT_LABELED_DATA';
export const insertLabeledData = (didAsset, ddo) => async (dispatch) => {
  firebase
    .database()
    .ref('details/' + didAsset + '/' + ddo.id)
    .set(ddo, function(e) {
      if (e) {
        console.log(e);
      } else {
        dispatch({
          type: GET_MY_ASSETS
        });
      }
    });
};

export const GET_MY_ASSETS = 'GET_MY_ASSETS';
export const getMyAssets = () => async (dispatch, getState) => {
  let state = getState();
  let ref = firebase.database().ref(`users/${state.account}/`);
  ref.on('value', async (snapshot) => {
    const myAssets = Object.values((await snapshot.val()) ? await snapshot.val() : {});
    dispatch({
      type: GET_MY_ASSETS,
      myAssets
    });
  });
};
