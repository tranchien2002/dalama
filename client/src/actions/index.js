import getWeb3 from 'utils/getWeb3';
import { Ocean } from '@oceanprotocol/squid';
import { aquariusUri, brizoUri, brizoAddress, nodeUri, secretStoreUri } from 'config';

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
    alert('Unknown network, please change network to Pacific network');
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

export const FETCH_ASSET = 'FETCH_ASSET';
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
    debugger;
    console.log('assets', search.results);
    dispatch({
      type: FETCH_ASSET,
      allAssets: search.results
    });
  } catch (e) {
    console.log(e);
  }
};
