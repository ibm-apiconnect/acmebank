/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const log = require('../../utils/logging').getLogger('common/models/account');
const uuid = require('uuid');

const FILTERED_PROPERTIES = ['id', 'balance'];

module.exports = function(Account) {

  Account.createOptionsFromRemotingContext = function(ctx) {
    return {
      customer: ctx.req.customer,
      product: ctx.req.product,
    };
  };

  Account.observe('before save', function filterProperties(ctx, next) {
    if (ctx.options && ctx.options.skipPropertyFilter) return next();
    if (ctx.isNewInstance) {
      ctx.instance.id = uuid.v4();
      ctx.instance.balance = 0;
      ctx.instance.active = true;
      ctx.instance.openDate = Date.now();
    } else if (ctx.instance) {
      FILTERED_PROPERTIES.forEach(function(p) {
        ctx.instance.unsetAttribute(p);
      });
    } else {
      FILTERED_PROPERTIES.forEach(function(p) {
        delete ctx.data[p];
      });
    }
    return next();
  });

  Account.handleTransaction = async (accountId, amount) => {
    let logger = log.child({
      function: 'handleTransaction',
    });
    let account = await Account.findById(accountId);
    account.balance = account.balance + amount;
    logger.trace(`Updating balance with new transaction for account: ${JSON.stringify(account)}`);
    await account.save({
      skipPropertyFilter: true,
    });
  };

};
