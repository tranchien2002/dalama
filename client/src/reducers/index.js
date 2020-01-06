import * as actions from 'actions';

const initialState = {
  web3: null,
  listAssets: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.WEB3_CONNECT:
      return {
        ...state,
        web3: action.web3,
        account: action.account
      };
    case actions.FETCH_ASSETS:
      console.log(action.assets);
      return {
        ...state,
        listAssets: action.assets
      };
    default:
      return state;
  }
};

export default rootReducer;
