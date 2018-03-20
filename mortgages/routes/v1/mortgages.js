'use strict';

const express = require('express');

const mortgages = require('../../lib/v1/mortgages');

const router = express.Router();

router.post('/', createMortgageAccount);
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => res.send({hello: 'world'}));

// eslint-disable-next-line no-unused-vars
async function createMortgageAccount(req, res, next) {
  let programId = req.body.programId;
  try {
    if (!programId) {
      let error = new Error('Please provide a programId');
      error.statusCode = 400;
      throw error;
    }
    let investment = await mortgages.createMortgageAccount(programId);
    res.send(investment);
  } catch (err) {
    res.status(err.statusCode || 500).send(err.message);
  }
}

module.exports = router;
