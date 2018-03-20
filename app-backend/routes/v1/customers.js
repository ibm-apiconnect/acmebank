/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict';

const express = require('express');

const customers = require('../../lib/v1/customers');

const router = express.Router();

router.get('/:customerId', getCustomer);
router.get('/:customerId/accounts', getCustomerAccounts);
router.get('/:customerId/accounts/:accountId/transactions', getAccountTransactions);
router.get('/:customerId/creditScores', getCreditScore);
router.get('/:customerId/expenses', getCustomerExpenseReport);
router.get('/:customerId/debts', getCustomerDebts);
router.get('/:customerId/savings', getCustomerSavings);
router.get('/:customerId/programs', getCustomerPrograms);
router.get('/:customerId/programs/:programName', getCustomerProgram);
router.patch('/:customerId/programs/:programName', updateCustomerProgram);
router.get('/:customerId/notifications', getCustomerNotifications);
router.post('/:customerId/notifications/:notificationId/ack', ackCustomerNotification);

// eslint-disable-next-line no-unused-vars
async function getCustomer(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let customer = await customers.getCustomerInfo(customerId);
    res.send(customer);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCustomerAccounts(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let accounts = await customers.getCustomerAccounts(customerId);
    res.send(accounts);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getAccountTransactions(req, res, next) {
  let customerId = req.params.customerId;
  let accountId = req.params.accountId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    if (!accountId) {
      let error = new Error('Please provide an accountId');
      error.statusCode = 400;
      throw error;
    }
    let transactions = await customers.getAccountTransactions(customerId, accountId);
    res.send(transactions);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCustomerPrograms(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let programs = await customers.getCustomerPrograms(customerId);
    res.send(programs);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCustomerProgram(req, res, next) {
  let customerId = req.params.customerId;
  let programName = req.params.programName;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    if (!programName) {
      let error = new Error('Please provide a programName');
      error.statusCode = 400;
      throw error;
    }
    let program = await customers.getCustomerProgram(customerId, programName);
    res.send(program);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function updateCustomerProgram(req, res, next) {
  let customerId = req.params.customerId;
  let programName = req.params.programName;
  let updateRequest = req.body;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    if (!programName) {
      let error = new Error('Please provide a programName');
      error.statusCode = 400;
      throw error;
    }
    let program = await customers.updateCustomerProgram(customerId, programName, updateRequest);
    res.send(program);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCustomerNotifications(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let notifications = await customers.getCustomerNotifications(customerId);
    res.send(notifications);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function ackCustomerNotification(req, res, next) {
  let customerId = req.params.customerId;
  let notificationId = req.params.notificationId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    if (!notificationId) {
      let error = new Error('Please provide a notificationId');
      error.statusCode = 400;
      throw error;
    }
    let notification = await customers.ackCustomerNotification(customerId, notificationId);
    res.send(notification);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCreditScore(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let scores = await customers.getCreditScores(customerId);
    res.send(scores[scores.length - 1]);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCustomerExpenseReport(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let accountsReport = await customers.getMonthlyExpenseReport(customerId);
    let expenseReport = {
      moneyIn: accountsReport.map(a => a.moneyIn).reduce((acc, val) => acc + val),    //only count checking accounts for money in
      moneyOut: accountsReport.map(a => a.moneyOut).reduce((acc, val) => acc + val),
      accounts: accountsReport,
    };
    res.send(expenseReport);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCustomerDebts(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let debtsReport = await customers.getCustomerDebts(customerId);
    res.send(debtsReport);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function getCustomerSavings(req, res, next) {
  let customerId = req.params.customerId;
  try {
    if (!customerId) {
      let error = new Error('Please provide a customerId');
      error.statusCode = 400;
      throw error;
    }
    let savings = await customers.getCustomerSavings(customerId);
    res.send(savings);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

module.exports = router;
