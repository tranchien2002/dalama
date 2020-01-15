import * as actions from 'actions';

const initialState = {
  web3: null,
  ocean: null,
  account: '',
  eth: 0,
  ocn: 0,
  allAssets: [],
  myAssets: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.WEB3_CONNECT:
      return {
        ...state,
        web3: action.web3,
        account: action.account,
        ocean: action.ocean,
        eth: action.eth,
        ocn: action.ocn
      };
    case actions.FETCH_ASSETS:
      return {
        ...state,
        allAssets: action.allAssets
      };
    case actions.GET_MY_ASSETS:
      return {
        ...state,
        myAssets: action.myAssets
      };
    default:
      return state;
  }
};

export default rootReducer;
