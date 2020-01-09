import * as actions from 'actions';

const initialState = {
  web3: null,
  ocean: null,
  account: null,
  allAssets: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.WEB3_CONNECT:
      return {
        ...state,
        web3: action.web3,
        account: action.account,
        ocean: action.ocean
      };
    case actions.FETCH_ASSET:
      return {
        ...state,
        allAssets: action.allAssets
      };
    default:
      return state;
  }
};

export default rootReducer;
