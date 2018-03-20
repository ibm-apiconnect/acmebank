/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const moment = require('moment');
const Promise = require('bluebird');
const rp = require('request-promise');

const log = require('../../utils/logging').getLogger('lib/v1/admin');

const accountsConfig = require('../../utils/conf').get('accounts');
const customersConfig = require('../../utils/conf').get('customers');
const documentsConfig = require('../../utils/conf').get('documents');
const notificationsConfig = require('../../utils/conf').get('notifications');

const customerId = require('../../utils/conf').get('customerId');

const checkingTransactions = require('../../data/checkingTransactions.json');
const savingsTransactions = require('../../data/savingsTransactions.json');
const creditCardTransactions = require('../../data/creditCardTransactions.json');

let accountsRequest = rp.defaults({
  baseUrl: accountsConfig.url,
  json: true,
});

let customersRequest = rp.defaults({
  baseUrl: customersConfig.url,
  json: true,
});

let documentsRequest = rp.defaults({
  baseUrl: documentsConfig.url,
  json: true,
});

let notificationsRequest = rp.defaults({
  baseUrl: notificationsConfig.url,
  json: true,
});

async function resetDemo() {
  await deleteAllAccounts();
  await deleteNotifications();
  await deleteDocuments();
  await deleteCustomerPrograms();
  await createInitialAccounts();
  await createInitialNotifications();
  await createHomeSavingsProgram();
}

async function deleteAllAccounts() {
  let logger = log.child({
    function: 'deleteAllAccounts',
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
  logger.info(`Found accounts: ${JSON.stringify(accounts)}`);
  await Promise.map(accounts, account => accountsRequest.delete({
    uri: `/accounts/${account.id}/transactions`,
  }));
  await Promise.map(accounts, account => accountsRequest.delete({
    uri: `/accounts/${account.id}`,
  }));
  logger.info(`Deleted ${accounts.length} accounts.`);
}

async function deleteNotifications() {
  let logger = log.child({
    function: 'deleteNotifications',
  });
  let notifications = await notificationsRequest.get({
    uri: '/notifications',
    qs: {
      filter: {
        where: {
          customerId,
        },
      },
    },
  });
  logger.info(`Found notifications: ${JSON.stringify(notifications)}`);
  await Promise.map(notifications, notification => notificationsRequest.delete({
    uri: `/notifications/${notification.id}`,
  }));
  logger.info(`Deleted ${notifications.length} notifications`);
}

async function deleteDocuments() {
  let logger = log.child({
    function: 'deleteDocuments',
  });
  let documents = await documentsRequest.get({
    uri: '/documents',
    qs: {
      filter: {
        where: {
          customerId,
        },
      },
    },
  });
  logger.info(`Found documents: ${JSON.stringify(documents)}`);
  await Promise.map(documents, doc => documentsRequest.delete({
    uri: `/documents/${doc.id}`,
  }));
  logger.info(`Deleted ${documents.length} documents`);
}

async function deleteCustomerPrograms() {
  let logger = log.child({
    function: 'deleteCustomerPrograms',
  });
  let customerPrograms = await customersRequest.get({
    uri: '/programs',
    qs: {
      filter: {
        where: {
          customerId,
        },
      },
    },
  });
  logger.info(`Found customer programs: ${JSON.stringify(customerPrograms)}`);
  await Promise.map(customerPrograms, program => customersRequest.delete({
    uri: `/programs/${program.id}`,
  }));
  logger.info(`Deleted ${customerPrograms.length} customer programs`);
}

async function createInitialAccounts() {
  let logger = log.child({
    function: 'createInitialAccounts',
  });
  let checkingAccount = await accountsRequest.post({
    uri: '/accounts',
    json: {
      customerId,
      productId: 'c7e0cdb5-9335-4999-afac-6201f775a260',
      name: 'Primary Checking',
      type: 'checking',
      active: true,
      openDate: '2018-01-10T01:14:47.482Z',
    },
  });
  logger.trace(`Created account: ${checkingAccount}`);
  await Promise.map(checkingTransactions, transaction => accountsRequest.post({
    uri: `/accounts/${checkingAccount.id}/transactions`,
    json: transaction,
  }));
  let savingsAccount = await accountsRequest.post({
    uri: '/accounts',
    json: {
      customerId,
      productId: '143275e4-41aa-436b-9cd0-119fb46ef539',
      name: 'Primary Savings',
      type: 'savings',
      active: true,
      openDate: '2018-01-10T01:14:27.203Z',
    },
  });
  logger.trace(`Created account: ${savingsAccount}`);
  await Promise.map(savingsTransactions, transaction => accountsRequest.post({
    uri: `/accounts/${savingsAccount.id}/transactions`,
    json: transaction,
  }));
  let creditCardAccount = await accountsRequest.post({
    uri: '/accounts',
    json: {
      customerId,
      productId: 'bb9acce3-a04e-48ca-8f46-dec0fdf7e62d',
      name: 'Signature Visa',
      type: 'credit',
      active: true,
      openDate: '2018-01-10T01:14:08.332Z',
    },
  });
  logger.trace(`Created account: ${creditCardAccount}`);
  await Promise.map(creditCardTransactions, transaction => accountsRequest.post({
    uri: `/accounts/${creditCardAccount.id}/transactions`,
    json: transaction,
  }));
}

async function createInitialNotifications() {
  let logger = log.child({
    function: 'createInitialNotifications',
  });
  let notification = await notificationsRequest.post({
    uri: '/notifications',
    json: {
      customerId,
      type: 'notice',
      active: true,
      unread: false,
      timestamp: '2018-01-10T13:43:48.219Z',
      title: 'Welcome to Acme Bank Online Banking',
      description: 'We\'re happy to have you. Please contact us if we can help you in any way.',
      from: 'Acme Bank',
    },
  });
  logger.trace(`Created notification: ${JSON.stringify(notification)}`);
}

async function createHomeSavingsProgram() {
  await customersRequest.post({
    uri:  '/programs',
    json: {
      customerId,
      name: 'homeSavings',
      data: {},
    },
  });
}

async function triggerWarningNotification() {
  let logger = log.child({
    function: 'triggerWarningNotification',
  });
  let notification = await notificationsRequest.post({
    uri: '/notifications',
    json: {
      customerId,
      type: 'notice',
      active: true,
      unread: true,
      title: 'Do you want to live with your parents forever?',
      description: 'Rob, it appears that you have exceeded your entertainment budget for the month in 1 day, what are you doing with your life?',
      from: 'Future Rob',
    },
  });
  logger.trace(`Created notification: ${JSON.stringify(notification)}`);
}

async function createTransactionsForAccounts() {
  let logger = log.child({
    function: 'createTransactionsForAccounts',
  });
  let numTransactions = 20;

  //get savings account
  let savingsAccounts = await accountsRequest.get({
    uri: '/accounts',
    qs: {
      filter: {
        where: {
          customerId,
          type: 'savings',
        },
      },
    },
  });
  logger.info(`Got savings accounts: ${JSON.stringify(savingsAccounts)}`);
  savingsAccounts.forEach(async (account) => {
    let latestTime = await getLatestTransactionTime(account);
    await addTransactions(account, Math.floor(numTransactions/4), latestTime);
  });

  //get all investment accounts
  let investmentAccounts = await accountsRequest.get({
    uri: '/accounts',
    qs: {
      filter: {
        where: {
          customerId,
          type: 'investment',
        },
      },
    },
  });
  logger.info(`Got investment accounts: ${JSON.stringify(investmentAccounts)}`);
  investmentAccounts.forEach(async (account) => {
    let latestTime = await getLatestTransactionTime(account);
    await addTransactions(account, Math.floor(numTransactions), latestTime);
  });
}

async function getLatestTransactionTime(account) {
  let transactions = await accountsRequest.get({
    uri: `/accounts/${account.id}/transactions`,
    qs: {
      filter: {
        order: 'timestamp desc',
        limit: 1,
      },
    },
  });
  return transactions[0].timestamp;
}

async function addTransactions(account, numTransactions, latestTime) {
  let logger = log.child({
    function: 'addTransactions',
  });
  let minAmount = 100;
  let maxAmount = 1000;
  logger.trace(`Creating ${numTransactions} transactions for ${account.type} account '${account.id}'`);
  let timestamp = latestTime;
  for (let i = 0; i < numTransactions; i++) {
    let randomNumDays = Math.floor(Math.random() * Math.floor(7)) + 1;
    timestamp = moment(timestamp).add(randomNumDays, 'days').format();
    let transaction = await accountsRequest.post({
      uri: `/accounts/${account.id}/transactions`,
      json: {
        type: 'deposit',
        amount: (Math.random() * (maxAmount - minAmount) + minAmount),
        timestamp,
        description: account.type === 'savings' ? 'Deposit' : 'Asset Growth',
        customerId: account.customerId,
      },
    });
    logger.trace(`Created transaction: ${JSON.stringify(transaction)}`);
  }
}


module.exports = {
  resetDemo,
  triggerWarningNotification,
  createTransactionsForAccounts,
};
