/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const uuid = require('uuid');

const logger = require('../../utils/logging').getLogger('common/models/transaction');

module.exports = function(Transaction) {

  Transaction.createOptionsFromRemotingContext = function(ctx) {
    return {
      account: ctx.req.account,
    };
  };

  Transaction.observe('before save', (ctx, next) => {
    if (ctx.options && ctx.options.skipPropertyFilter) return next();
    if (ctx.isNewInstance) {
      ctx.instance.id = uuid.v4();
      if (!ctx.instance.timestamp) {
        ctx.instance.timestamp = Date.now();
      }
    }
    return next();
  });

  Transaction.observe('after save', (ctx, next) => {
    logger.trace(`Updating balance for account '${ctx.instance.accountId}' with transaction '${ctx.instance.id}': ${ctx.instance.amount}`);
    Transaction.app.models.Account.handleTransaction(ctx.instance.accountId, ctx.instance.amount)
      .then(() => next());
  });

};
