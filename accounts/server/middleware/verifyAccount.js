/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const app = require('../../server/server');
const log = require('../../utils/logging').getLogger('middleware/verifyAccount');

async function verifyAccount(req, res, next) {
  let logger = log.child({
    function: 'verifyAccount',
  });
  let Account = app.models.account;
  let accountId = req.body.accountId;
  let acct = await Account.findById(accountId);
  if (!acct) {
    logger.error(`Account '${accountId}' not found`);
    let error = new Error(`Account '${accountId}' not found`);
    error.statusCode = 404;
    return next(error);
  }
  req.account = acct;
  next();
}

module.exports = () => verifyAccount;
