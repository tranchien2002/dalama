import getWeb3 from 'utils/getWeb3';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

const client = Stitch.initializeDefaultAppClient('ocean-assets-zduhd');
const mongodb = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
const db = mongodb.db('ocean');

export const FETCH_ASSETS = 'FETCH_ASSETS';
export const fetchAssest = () => async (dispatch) => {
  client.auth
    .loginWithCredential(new AnonymousCredential())
    .then(
      db
        .collection('assets')
        .find({}, { limit: 1000 })
        .asArray()
        .then((assets) => {
          dispatch({
            type: FETCH_ASSETS,
            assets
          });
        })
    )
    .catch(console.error);
};

export const WEB3_CONNECT = 'WEB3_CONNECT';
export const web3Connect = () => async (dispatch) => {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  if (web3.currentProvider.networkVersion !== '8995') {
    alert('Unknown network, please change network to Ropsten network');
    return;
  }
  if (accounts.length > 0) {
    const account = accounts[0];
    dispatch({
      type: WEB3_CONNECT,
      web3,
      account
    });
  } else {
    console.log('Account not found');
  }
};
