'use strict';

const express = require('express');
const router = express.Router();

const started = Date.now();

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', function(req, res, next) {
  res.send({
    started,
    uptime: (Date.now() - started) / 1000,
  });
});

router.use('/v1/calculations', require('./v1/calculations'));
router.use('/v1/customers', require('./v1/customers'));
router.use('/v1/homes', require('./v1/homes'));
router.use('/v1/documents', require('./v1/documents'));
router.use('/v1/investments', require('./v1/investments'));
router.use('/v1/admin', require('./v1/admin'));

module.exports = router;
