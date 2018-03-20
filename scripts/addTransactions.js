const moment = require('moment');
const Promise = require('bluebird');
const rp = require('request-promise');

const customerId = require('./utils/conf').get('customerId');
const accountsConfig = require('./utils/conf').get('accounts');
const customersConfig = require('./utils/conf').get('customers');
const documentsConfig = require('./utils/conf').get('documents');
const notificationsConfig = require('./utils/conf').get('notifications');
const investmentsConfig = require('./utils/conf').get('investments');

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

let investmentsRequest = rp.defaults({
  baseUrl: investmentsConfig.url,
  json: true,
});

let numTransactions = 20;
let minAmount = 100;
let maxAmount = 500;

async function run(){
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
  console.log('found savings accounts:');
  console.log(savingsAccounts);
  savingsAccounts.forEach(async (account) => {
    let latestTime = await getLatestTransactionTime(account);
    await addTransactions(account, Math.floor(numTransactions/4), latestTime);
  })
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
  console.log('found investment accounts:');
  console.log(investmentAccounts);
  investmentAccounts.forEach(async (account) => {
    let latestTime = await getLatestTransactionTime(account);
    await addTransactions(account, Math.floor(numTransactions), latestTime);
  })
}

async function getLatestTransactionTime(account) {
  let transactions = await accountsRequest.get({
    uri: `/accounts/${account.id}/transactions`,
    qs: {
      filter: {
        order: 'timestamp desc',
        limit: 1
      },
    },
  });
  console.log(transactions);
  return transactions[0].timestamp;
}

async function addTransactions(account, numTransactions, latestTime) {
  console.log(`Creating ${numTransactions} transactions for ${account.type} account '${account.id}'`);
  let timestamp = latestTime;
  for (let i = 0; i < numTransactions; i++){
    let randomNumDays = Math.floor(Math.random() * Math.floor(7)) + 1;
    timestamp = moment(timestamp).add(randomNumDays, 'days').format();
    console.log(timestamp);
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
    console.log(`Created transaction: ${JSON.stringify(transaction)}`);
  }
}

run();