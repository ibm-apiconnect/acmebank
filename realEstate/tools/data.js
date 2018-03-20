/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*eslint-disable no-console*/

const _ = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const Queue = require('promise-queue');
const rp = require('request-promise');
const slugify = require('slugify');

let promiseQueue = new Queue(100, Infinity);

const filenames = {
  1: '1bedroom.csv',
  2: '2bedroom.csv',
  3: '3bedroom.csv',
  4: '4bedroom.csv',
  5: '5bedroom.csv',
};
const url = process.env.APP_URL || 'http://localhost:4006';

const dataToLoad = process.argv[2];

console.log(`Preparing to load data set for ${dataToLoad} bedrooms.`);

let numRecords = 0;

fs.createReadStream(filenames[dataToLoad])
  .pipe(csv())
  .on('data', async function (data) {
    let record = {
      id: slugify(`${data.State}-${data.City}-${dataToLoad}-${data.RegionName}`),
      neighborhood: data.RegionName,
      city: data.City,
      state: data.State,
      metro: data.Metro,
      county: data.CountyName,
      bedrooms: dataToLoad,
    };
    let medianValues = _.omit(data, ['RegionName', 'City', 'State', 'Metro', 'CountyName', 'SizeRank', 'RegionId']);
    for (let date in  medianValues) {
      if (medianValues[date]) {
        medianValues[date] = parseInt(medianValues[date]);
      }
    }
    record.medianValues = medianValues;
    promiseQueue.add(async () => {
      let status = await rp.put({
        uri: `${url}/api/homeValues`,
        json: record,
      });
      numRecords++;
      console.log(`${numRecords}: ${record.id}`);
      return status;
    });
  });
