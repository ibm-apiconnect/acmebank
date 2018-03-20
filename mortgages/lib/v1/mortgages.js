/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const rp = require('request-promise');

const log = require('../../utils/logging').getLogger('lib/v1/mortgages');

const accountsConfig = require('../../utils/conf').get('accounts');
const customersConfig = require('../../utils/conf').get('customers');

const mortgageProductId = require('../../utils/conf').get('productId');

let accountsRequest = rp.defaults({
  baseUrl: accountsConfig.url,
  json: true,
});

let customersRequest = rp.defaults({
  baseUrl: customersConfig.url,
  json: true,
});

async function createMortgageAccount(programId) {
  let logger = log.child({
    function: 'createMorgageAccount',
  });
  let program = await customersRequest.get({
    uri: `programs/${programId}`,
  });
  logger.trace(`Got program: ${JSON.stringify(program)}`);
  let account = {
    name: 'Mortgage',
    customerId: program.customerId,
    type: 'mortgage',
    productId: mortgageProductId,
  };
  logger.trace(`Preparing to create account: ${JSON.stringify(account)}`);
  let newAccount = await accountsRequest.post({
    uri: '/accounts',
    json: account,
  });
  logger.trace(`Created account: ${JSON.stringify(newAccount)}`);
  let transaction = await accountsRequest.post({
    uri: `/accounts/${newAccount.id}/transactions`,
    json: {
      customerId: newAccount.customerId,
      description: 'Mortgage Origination',
      amount: (program.data.homeValue * -0.8),
      type: 'expense',
    },
  });
  logger.trace(`Created transaction: ${JSON.stringify(transaction)}`);
  return account;
}

module.exports = {
  createMortgageAccount,
};
