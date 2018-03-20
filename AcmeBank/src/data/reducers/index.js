/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../../navigators/AppNavigator';

function nav(state, action) {
  let nextState;
  switch (action.type) {
  case 'Login':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Accounts' }),
        state
      );
    break;
  case 'Logout':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
    break;
  case 'GTM':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.step }),
        state
      );
    break;
  case 'Home':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Accounts' }),
        state
      );
    break;
  case 'Mortgage':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Mortgage' }),
        state
      );
    break;
  case 'AccountDetails':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'AccountDetails' }),
        state
      );
    break;
  case 'DocumentViewer':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'DocumentViewer' }),
        state
      );
    break;
  case 'Notifications':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Notifications' }),
        state
      );
    break;
  case 'My Home':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'My Home' }),
        state
      );
    break;
  case 'NextGoal':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: `${action.investment}Investment` }),
        state
      );
    break;
  case 'BillPay':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'BillPay' }),
        state
      );
    break;
  case 'Deposit':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Deposit' }),
        state
      );
    break;
  case 'Help':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Help' }),
        state
      );
    break;
  case 'Transfer':
    nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Transfer' }),
        state
      );
    break;
  default:
    nextState = AppNavigator.router.getStateForAction(action, state);
    break;
  }

  return nextState || state;
}

function customerData(state = {}, action) {
  switch (action.type) {
  case 'RECEIVE_CUSTOMERINFO':
    return Object.assign({}, state, { info: action.payload });
  case 'RECEIVE_ACCOUNTS':
    return Object.assign({}, state, { accounts: action.payload });
  case 'RECEIVE_TRANSACTIONS':
    return Object.assign({}, state, { transactions: action.payload });
  case 'SET_ACCOUNT':
    return Object.assign({}, state, { account: action.payload });
  case 'RECEIVE_CREDITSCORE':
    return Object.assign({}, state, { creditScore: action.payload });
  case 'RECEIVE_MONTHLYEXPENSEREPORT':
    return Object.assign({}, state, { monthlyExpenseReport: action.payload });
  case 'RECEIVE_DEBTS':
    return Object.assign({}, state, { debts: action.payload });
  case 'RECEIVE_INVESTMENTPROFILE':
    return Object.assign({}, state, { investmentProfile: action.payload });
  case 'RECEIVE_SAVINGS':
    return Object.assign({}, state, { savings: action.payload });
  case 'RECEIVE_NOTIFICATIONS':
    return Object.assign({}, state, { notifications: action.payload });
  case 'RECEIVE_PROGRAMS':
    return Object.assign({}, state, { programs: action.payload });
  case 'RECEIVE_HOMESAVINGSPROGRAMSTATUS':
    return Object.assign({}, state, { homeSavingsProgramStatus: action.payload });
  default:
    return state;
  }
}

function homeData(state = {}, action) {
  switch (action.type) {
  case 'RECEIVE_HOMEVALUE':
    return Object.assign({}, state, { value: action.payload.averageHomeValue });
  case 'RECEIVE_SUGGESTIONS':
    return Object.assign({}, state, { suggestions: action.payload });
  case 'SET_CITY':
    return Object.assign({}, state, { city: action.payload });
  case 'SET_HOMEDETAILS':
    return Object.assign({}, state, { details: action.payload });
  case 'SET_MONTHLYSAVINGSNEEDED':
    return Object.assign({}, state, { monthlySavingsNeeded: action.payload });

  default:
    return state;
  }
}

function documentData(state = {}, action) {
  switch (action.type) {
  case 'SET_DOCUMENT':
    return Object.assign({}, state, { id: action.payload });
  case 'RECEIVE_DOCUMENT':
    return Object.assign({}, state, { doc: action.payload });
  default:
    return state;
  }
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
  case 'Login':
    return { ...state, isLoggedIn: true };
  case 'Logout':
    return { ...state, isLoggedIn: false };
  default:
    return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
  customerData,
  homeData,
  documentData,
});

export default AppReducer;