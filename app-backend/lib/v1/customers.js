/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const rp = require('request-promise');

const documents = require('./documents');
const log = require('../../utils/logging').getLogger('lib/v1/customers');

const customersConfig = require('../../utils/conf').get('customers');
const accountsConfig = require('../../utils/conf').get('accounts');
const creditConfig = require('../../utils/conf').get('credit');
const notificationsConfig = require('../../utils/conf').get('notifications');

let customersRequest = rp.defaults({
  baseUrl: customersConfig.url,
  json: true,
});

let accountsRequest = rp.defaults({
  baseUrl: accountsConfig.url,
  json: true,
});

let creditRequest = rp.defaults({
  baseUrl: creditConfig.url,
  json: true,
});

let notificationsRequest = rp.defaults({
  baseUrl: notificationsConfig.url,
  json: true,
});

async function getCustomerInfo(customerId) {
  let logger = log.child({
    function: 'getCustomerInfo',
  });
  let customer = await customersRequest.get({
    uri: `/customers/${customerId}`,
  });
  logger.trace(`Got customer: ${JSON.stringify(customer)}`);
  return customer;
}

async function getCustomerNotifications(customerId) {
  let logger = log.child({
    function: 'getCustomerNotifications',
  });
  let notifications = await notificationsRequest.get({
    uri: '/notifications',
    qs: {
      filter: {
        where: {
          customerId,
          active: true,
        },
        order: 'timestamp desc',
      },
    },
  });
  logger.trace(`Got notifications: ${JSON.stringify(notifications)}`);
  return notifications;
}

async function ackCustomerNotification(customerId, notificationId) {
  let logger = log.child({
    function: 'ackCustomerNotification',
  });
  let notification = await notificationsRequest.patch({
    uri: `/notifications/${notificationId}`,
    body: {
      unread: false,
    },
  });
  logger.trace(`Got notification: ${JSON.stringify(notification)}`);
  return notification;
}

async function createCustomerNotification(customerId, data) {
  let logger = log.child({
    function: 'createCustomerNotification',
  });
  let notification = await notificationsRequest.post({
    uri: '/notifications',
    body: {
      customerId,
      ...data,
    },
  });
  logger.trace(`Got notification: ${JSON.stringify(notification)}`);
  return notification;
}

async function getCustomerAccounts(customerId) {
  let logger = log.child({
    function: 'getCustomerAccounts',
  });
  let accounts = await accountsRequest.get({
    uri: '/accounts',
    qs: {
      filter: {
        where: {
          customerId,
        },
      },
    },
  });
  logger.trace(`Got accounts: ${JSON.stringify(accounts)}`);
  accounts = _.filter(accounts, (a) => {
    return a.type === 'checking' || a.type === 'savings' || a.type === 'credit' || a.type === 'mortgage';
  });
  return accounts;
}

async function getAccountTransactions(customerId, accountId) {
  let logger = log.child({
    function: 'getAccountTransactions',
  });
  let transactions = await accountsRequest.get({
    uri: `/accounts/${accountId}/transactions`,
    qs: {
      filter: {
        order: 'timestamp desc',
      },
    },
  });
  logger.trace(`Got transactions: ${JSON.stringify(transactions)}`);
  return transactions;
}

async function getCustomerPrograms(customerId) {
  let logger = log.child({
    function: 'getCustomerPrograms',
  });
  let programs = await customersRequest.get({
    uri: `/customers/${customerId}/programs`,
  });
  logger.trace(`Got programs: ${JSON.stringify(programs)}`);
  return programs;
}

async function getCustomerProgram(customerId, programName) {
  let logger = log.child({
    function: 'getCustomerProgram',
  });
  let program = await customersRequest.get({
    uri: '/programs/findOne',
    qs: {
      filter: {
        where: {
          customerId,
          name: programName,
        },
      },
    },
  });
  logger.trace(`Got program: ${JSON.stringify(program)}`);
  return program;
}

async function updateCustomerProgram(customerId, programName, updateRequest) {
  let logger = log.child({
    function: 'updateCustomerProgram',
  });
  let program = await customersRequest.get({
    uri: '/programs/findOne',
    qs: {
      filter: {
        where: {
          customerId,
          name: programName,
        },
      },
    },
  });
  program = await customersRequest.patch({
    uri: `programs/${program.id}`,
    json: updateRequest,
  });
  logger.trace(`Got program: ${JSON.stringify(program)}`);
  if (updateRequest.enrolled) { 
    //create new document
    let document = await documents.createDocument({
      customerId,
      documentType: 'accountConsent',
      title: 'Consent to Open Financial Accounts',
      programId: program.id,
    });
    //create new notification
    await createCustomerNotification(customerId, {
      type: 'document',
      documentId: document.id,
      title: 'Sign your investment documents',
      description: 'In order for us to manage your accounts, we need your consent on file. Click here to view the document',
      from: 'Acme Bank',
    });
  }
  if (updateRequest.lenderContacted) {
    //create new document
    let document = await documents.createDocument({
      customerId,
      documentType: 'mortgageOrigination',
      title: 'Mortgage Closing',
      programId: program.id,
    });
    //create new notification
    await createCustomerNotification(customerId, {
      type: 'document',
      documentId: document.id,
      title: 'Sign your closing documents',
      description: 'Congratulations on hitting this huge milestone. Click here to view your mortgage closing documents.',
      from: 'Acme Bank',
    });
  }
  return program;
}

async function getCreditScores(customerId) {
  let logger = log.child({
    function: 'getCreditScore',
  });
  let scores = await creditRequest.get({
    uri: '/scores',
    qs: {
      filter: {
        where: {
          customerId,
        },
      },
    },
  });
  scores = _.sortBy(scores, score => new Date(score.date) );
  logger.trace(`Got scores: ${JSON.stringify(scores)}`);
  return scores;
}

async function getMonthlyExpenseReport(customerId) {
  let logger = log.child({
    function: 'getMonthlyExpenseReport',
  });
  let accounts = await getCustomerAccounts(customerId);
  logger.trace(`Got accounts: ${JSON.stringify(accounts)}`);
  let date = new Date();
  let lastMonthStart = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  let lastMonthEnd = new Date(date.getFullYear(), date.getMonth(), 1);
  logger.trace(`lastMonthStart: ${lastMonthStart}`);
  logger.trace(`lastMonthEnd: ${lastMonthEnd}`);
  accounts = await Promise.map(accounts, async (account) => {
    let transactions = await getAccountTransactions(customerId, account.id);
    logger.trace(`Got transactions for account '${account.id}': ${JSON.stringify(transactions)}`);
    let lastMonthsTransactions = _.filter(transactions, (t) => {
      let transactionDate = new Date(t.timestamp);
      return transactionDate >= lastMonthStart && transactionDate < lastMonthEnd;
    });
    lastMonthsTransactions = _.filter(lastMonthsTransactions, (t) => {
      return t.type !== 'transfer';
    });
    logger.trace(`Got filtered transactions for account '${account.id}': ${JSON.stringify(lastMonthsTransactions)}`);
    let positiveTransactions = _.filter(lastMonthsTransactions, (t) => t.amount >=0);
    let negativeTransactions = _.filter(lastMonthsTransactions, (t) => t.amount <0);
    let moneyIn = positiveTransactions.length ? positiveTransactions.map(t => t.amount).reduce((acc, val) => acc + val) : 0;
    let moneyOut = negativeTransactions.length ? negativeTransactions.map(t => t.amount).reduce((acc, val) => acc + val) : 0;
    return {...account, lastMonthsTransactions, moneyIn, moneyOut};
  });
  return accounts;
}

async function getCustomerSavings(customerId) {
  let logger = log.child({
    function: 'getCustomerSavings',
  });
  let accounts = await accountsRequest.get({
    uri: '/accounts',
    qs: {
      filter: {
        where: {
          customerId,
        },
      },
    },
  });
  accounts = _.filter(accounts, a => (a.type === 'savings' || a.type === 'investment'));
  logger.trace(`Got accounts: ${JSON.stringify(accounts)}`);
  let amount = accounts.map(a => a.balance).reduce((acc, val) => acc + val);

  return {
    accounts,
    amount,
  };
}

async function getCustomerDebts(customerId) {
  let debt = Math.floor(Math.random() * 70000) + 7500;
  return {
    customerId,
    debt,
  };
}

module.exports = {
  getCustomerInfo,
  getCustomerNotifications,
  ackCustomerNotification,
  getCustomerAccounts,
  getAccountTransactions,
  getCreditScores,
  getMonthlyExpenseReport,
  getCustomerDebts,
  getCustomerSavings,
  getCustomerPrograms,
  getCustomerProgram,
  updateCustomerProgram,
};
