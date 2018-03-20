/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import fetch from 'cross-fetch';
import config from 'react-global-configuration';

import { getRequestDefaults, handleErrors, getQueryParam } from '../../utils/fetch';

export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS';
export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS';
export const SET_ACCOUNT = 'SET_ACCOUNT';

export const FETCH_TRANSACTIONS = 'FETCH_TRANSACTIONS';
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS';

export const FETCH_CUSTOMERINFO = 'FETCH_CUSTOMERINFO';
export const RECEIVE_CUSTOMERINFO = 'RECEIVE_CUSTOMERINFO';

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS';

export const SET_DOCUMENT = 'SET_DOCUMENT';
export const FETCH_DOCUMENT = 'FETCH_DOCUMENT';
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT';

export const SET_CITY = 'SET_CITY';
export const SET_HOMEDETAILS = 'SET_HOMEDETAILS';
export const FETCH_HOMEVALUE = 'FETCH_HOMEVALUE';
export const RECEIVE_HOMEVALUE = 'RECEIVE_HOMEVALUE';

export const FETCH_MONTHLYEXPENSEREPORT = 'FETCH_MONTHLYEXPENSEREPORT';
export const RECEIVE_MONTHLYEXPENSEREPORT = 'RECEIVE_MONTHLYEXPENSEREPORT';

export const FETCH_DEBTS = 'FETCH_DEBTS';
export const RECEIVE_DEBTS = 'RECEIVE_DEBTS';

export const FETCH_CREDITSCORE = 'FETCH_CREDITSCORE';
export const RECEIVE_CREDITSCORE = 'RECEIVE_CREDITSCORE';

export const FETCH_SAVINGS = 'FETCH_SAVINGS';
export const RECEIVE_SAVINGS = 'RECEIVE_SAVINGS';

export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const RECEIVE_SUGGESTIONS = 'RECEIVE_SUGGESTIONS';

export const SET_MONTHLYSAVINGSNEEDED = 'SET_MONTHLYSAVINGSNEEDED';

export const FETCH_INVESTMENTPROFILE = 'FETCH_INVESTMENTPROFILE';
export const RECEIVE_INVESTMENTPROFILE = 'RECEIVE_INVESTMENTPROFILE';

export const FETCH_PROGRAMS = 'FETCH_PROGRAMS';
export const RECEIVE_PROGRAMS = 'RECEIVE_PROGRAMS';

export const FETCH_HOMESAVINGSPROGRAMSTATUS = 'FETCH_HOMESAVINGSPROGRAMSTATUS';
export const RECEIVE_HOMESAVINGSPROGRAMSTATUS = 'RECEIVE_HOMESAVINGSPROGRAMSTATUS';

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';
export const RESET_DEMO = 'RESET_DEMO';

export function addTransactions () {
  return dispatch => {
    let url = '/v1/admin/addTransactions';
    let requestOpts = Object.assign({}, getRequestDefaults(url), {method: 'post'});
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              return response.json();
            });
  };
}

export function triggerWarningNotification () {
  return dispatch => {
    let url = '/v1/admin/triggerWarningNotification';
    let requestOpts = Object.assign({}, getRequestDefaults(url), {method: 'post'});
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              return response.json();
            });
  };
}

export function resetDemo () {
  return dispatch => {
    let url = '/v1/admin/resetDemo';
    let requestOpts = Object.assign({}, getRequestDefaults(url), {method: 'post'});
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              return response.json();
            })
            .then(() => dispatch({type: 'Logout'}));
  };
}

export function fetchPrograms (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/programs`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status === 404) {
                throw new Error('Customer not found');
              }

              return response.json();
            })
            .then(json => dispatch(receivePrograms(json)))
            .catch(() => {});
  };
}

export function receivePrograms (payload) {
  return {
    type: RECEIVE_PROGRAMS,
    payload,
  };
}

export function getHomeSavingsProgramStatus (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/programs/homeSavings`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status === 404) {
                throw new Error('Customer not found');
              }

              return response.json();
            })
            .then(json => dispatch(receiveHomeSavingsProgramStatus(json)));
  };
}

export function receiveHomeSavingsProgramStatus (payload) {
  return {
    type: RECEIVE_HOMESAVINGSPROGRAMSTATUS,
    payload,
  };
}

export function updateHomeSavingsProgramStatus (customerId, updateData) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/programs/homeSavings`;
    let requestOpts = Object.assign({}, getRequestDefaults(url), {method: 'patch', body: JSON.stringify(updateData)});
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status === 404) {
                throw new Error('Customer not found');
              }

              return response.json();
            })
            .then(json => dispatch(getHomeSavingsProgramStatus(customerId)));
  };
}

export function fetchAccounts (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/accounts`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status === 404) {
                throw new Error('Customer not found');
              }

              return response.json();
            })
            .then(json => dispatch(receiveAccounts(json)))
            .catch(() => {});
  };
}

export function receiveAccounts (payload) {
  return {
    type: RECEIVE_ACCOUNTS,
    payload,
  };
}

export function setAccount (payload) {
  return {
    type: SET_ACCOUNT,
    payload,
  };
}

export function fetchTransactions (customerId, accountId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/accounts/${accountId}/transactions`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status === 404) {
                throw new Error('Account not found');
              }

              return response.json();
            })
            .then(json => dispatch(receiveTransactions(json)))
            .catch(() => {});
  };
}

export function receiveTransactions (payload) {
  return {
    type: RECEIVE_TRANSACTIONS,
    payload,
  };
}

export function setCity (payload) {
  return {
    type: SET_CITY,
    payload,
  };
}

export function setHomeDetails (payload) {
  return {
    type: SET_HOMEDETAILS,
    payload,
  };
}

export function setMonthlySavingsNeeded (payload) {
  return {
    type: SET_MONTHLYSAVINGSNEEDED,
    payload,
  };
}

export function fetchCustomerInfo (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveCustomerInfo(json)))
            .catch(() => {});
  };
}

export function receiveCustomerInfo (payload) {
  return {
    type: RECEIVE_CUSTOMERINFO,
    payload,
  };
}

export function fetchNotifications (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/notifications`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveNotifications(json)))
            .catch(() => {});
  };
}

export function ackNotification (customerId, notificationId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/notifications/${notificationId}/ack`;
    let requestOpts = Object.assign({}, getRequestDefaults(url), {method: 'post'});
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(fetchNotifications(customerId)))
            .catch(() => {});
  };
}

export function receiveNotifications (payload) {
  return {
    type: RECEIVE_NOTIFICATIONS,
    payload,
  };
}

export function setDocument (payload) {
  return {
    type: SET_DOCUMENT,
    payload,
  };
}

export function fetchDocument (documentId) {
  return dispatch => {
    let url = `/v1/documents/${documentId}`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveDocument(json)))
            .catch(() => {});
  };
}

export function signDocument (documentId) {
  return dispatch => {
    let url = `/v1/documents/${documentId}/sign`;
    let requestOpts = Object.assign({}, getRequestDefaults(url), {method: 'post'});
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(fetchDocument(documentId)))
            .catch(() => {});
  };
}

export function receiveDocument (payload) {
  return {
    type: RECEIVE_DOCUMENT,
    payload,
  };
}

export function fetchHomeValue (city, homeDetails) {
  return dispatch => {
    let url = '/v1/homes/values';
    let requestOpts = getRequestDefaults(url, Object.assign({}, {city}, homeDetails));
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveHomeValue(json)))
            .catch(() => {});
  };
}

export function receiveHomeValue (payload) {
  return {
    type: RECEIVE_HOMEVALUE,
    payload,
  };
}

export function fetchCreditScore (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/creditScores`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveCreditScore(json)))
            .catch(() => {});
  };
}

export function receiveCreditScore (payload) {
  return {
    type: RECEIVE_CREDITSCORE,
    payload,
  };
}

export function fetchMonthlyExpenseReport (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/expenses`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveMonthlyExpenseReport(json)))
            .catch(() => {});
  };
}

export function receiveMonthlyExpenseReport (payload) {
  return {
    type: RECEIVE_MONTHLYEXPENSEREPORT,
    payload,
  };
}

export function fetchDebtsReport (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/debts`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveDebtsReport(json)))
            .catch(() => {});
  };
}

export function receiveDebtsReport (payload) {
  return {
    type: RECEIVE_DEBTS,
    payload,
  };
}

export function fetchSavings (customerId) {
  return dispatch => {
    let url = `/v1/customers/${customerId}/savings`;
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveSavings(json)))
            .catch(() => {});
  };
}

export function receiveSavings (payload) {
  return {
    type: RECEIVE_SAVINGS,
    payload,
  };
}

export function fetchSuggestions (savingsRatio, debtToIncomeRatio, creditScore) {
  return dispatch => {
    let url = '/v1/calculations/suggestions';
    let body = {
      savingsRatio,
      debtToIncomeRatio,
      creditScore,
    };
    let requestOpts = Object.assign({}, getRequestDefaults(url), {method: 'post', body: JSON.stringify(body)});
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveSuggestions(json)))
            .catch(() => {});
  };
}

export function receiveSuggestions (payload) {
  return {
    type: RECEIVE_SUGGESTIONS,
    payload,
  };
}

export function getInvestmentProfile (investmentProfileValue) {
  return dispatch => {
    let url = '/v1/investments/profiles';
    let requestOpts = getRequestDefaults(url);
    return fetch(requestOpts.url, requestOpts)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('An error occurred');
              }

              return response.json();
            })
            .then(json => dispatch(receiveInvestmentProfile(json[investmentProfileValue])))
            .catch(() => {});
  };
}

export function receiveInvestmentProfile (payload) {
  return {
    type: RECEIVE_INVESTMENTPROFILE,
    payload,
  };
}