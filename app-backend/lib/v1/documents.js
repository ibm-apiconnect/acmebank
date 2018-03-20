/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const rp = require('request-promise');

const log = require('../../utils/logging').getLogger('lib/v1/homes');

const customersConfig = require('../../utils/conf').get('customers');
const documentsConfig = require('../../utils/conf').get('documents');
const investmentsConfig = require('../../utils/conf').get('investments');
const mortgagesConfig = require('../../utils/conf').get('mortgages');

let customersRequest = rp.defaults({
  baseUrl: customersConfig.url,
  json: true,
});

let documentsRequest = rp.defaults({
  baseUrl: documentsConfig.url,
  json: true,
});

let investmentsRequest = rp.defaults({
  baseUrl: investmentsConfig.url,
  json: true,
});

let mortgagesRequest = rp.defaults({
  baseUrl: mortgagesConfig.url,
  json: true,
});

async function getDocument(documentId) {
  let logger = log.child({
    function: 'getDocument',
  });
  let document = await documentsRequest.get({
    uri: `/documents/${documentId}`,
  });
  logger.trace(`Got document: ${JSON.stringify(document)}`);
  return document;
}

async function signDocument(documentId) {
  let logger = log.child({
    function: 'signDocument',
  });
  let document = await documentsRequest.patch({
    uri: `/documents/${documentId}`,
    json: {
      signDate: Date.now(),
    },
  });
  logger.trace(`Got document: ${JSON.stringify(document)}`);
  if (document.type == 'accountConsent') {
    await addConsentToCustomerProgram(document.programId);
    await createInvestmentAccounts(document.programId);
  } else if (document.type == 'mortgageOrigination') {
    await completeCustomerProgram(document.programId);
    await createMortgageAccount(document.programId);
  }
  return document;
}

async function createDocument(documentData) {
  let logger = log.child({
    function: 'createDocument',
  });
  let document = await documentsRequest.post({
    uri: '/documents',
    json: {
      customerId: documentData.customerId,
      type: documentData.documentType,
      title: documentData.title,
      programId: documentData.programId,
    },
  });
  logger.trace(`Got document: ${JSON.stringify(document)}`);
  return document;
}

async function addConsentToCustomerProgram(programId) {
  let logger = log.child({
    function: 'addConsentToCustomerProgram',
  });
  let program = await customersRequest.patch({
    uri: `/programs/${programId}`,
    json: {
      consentSigned: true,
    },
  });
  logger.trace(`Got program: ${JSON.stringify(program)}`);
  return program;
}

async function completeCustomerProgram(programId) {
  let logger = log.child({
    function: 'completeCustomerProgram',
  });
  let program = await customersRequest.patch({
    uri: `/programs/${programId}`,
    json: {
      completed: true,
    },
  });
  logger.trace(`Got program: ${JSON.stringify(program)}`);
  return program;
}

async function createInvestmentAccounts(programId) {
  let logger = log.child({
    function: 'createInvestmentAccounts',
  });
  let investment = await investmentsRequest.post({
    uri: '/investments',
    json: {
      programId,
    },
  });
  logger.trace(`Got investment: ${JSON.stringify(investment)}`);
  return investment;
}

async function createMortgageAccount(programId) {
  let logger = log.child({
    function: 'createMortgageAccount',
  });
  let mortgage = await mortgagesRequest.post({
    uri: '/mortgages',
    json: {
      programId,
    },
  });
  logger.trace(`Got morgage: ${JSON.stringify(mortgage)}`);
  return mortgage;
}

module.exports = {
  getDocument,
  signDocument,
  createDocument,
};
