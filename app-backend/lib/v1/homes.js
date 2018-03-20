/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

const _ = require('lodash');
const rp = require('request-promise');

const log = require('../../utils/logging').getLogger('lib/v1/homes');

const realEstateConfig = require('../../utils/conf').get('realEstate');

let realEstateRequest = rp.defaults({
  baseUrl: realEstateConfig.url,
  json: true,
});

async function getAverageHomeValue(city, homeDetails) {
  let logger = log.child({
    function: 'getAverageHomeValue',
  });
  homeDetails = _.pick(homeDetails, 'bedrooms');
  let values = await realEstateRequest.get({
    uri: '/homeValues',
    qs: {
      filter: {
        where: Object.assign({city}, homeDetails),
      },
    },
  });
  // determine latest month of data
  let month = '2018-01';
  logger.trace(`Latest month of data is: ${month}`);
  // average remaining dataset
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i].medianValues[month];
  }
  let avg = sum / values.length;
  return avg;
}

module.exports = {
  getAverageHomeValue,
};
