/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*eslint-disable no-console*/

const faker = require('faker');
const Promise = require('bluebird');
const rp = require('request-promise');

const numRecords = process.argv[2];
const url = process.env.APP_URL || 'http://localhost:4001';

function generateRecord() {
  let record =  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    dateOfBirth: faker.date.between(new Date('1965-01-01'), new Date('1998-12-31')),
    ssn: (Math.floor(Math.random() * 899999999) + 100000000),
    phone: faker.phone.phoneNumberFormat(0),
    streetAddress: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(true),
    zip: faker.address.zipCode(),
    ownHome: faker.random.boolean(),
  };
  record.email = faker.internet.email(record.firstName, record.lastName);
  return record;
}

async function run () {
  let promises = [];
  for (let i=0; i<numRecords; i++) {
    let record = generateRecord();
    promises.push(rp.post({
      uri: `${url}/api/customers`,
      json: record,
    }));
  }
  await Promise.all(promises);
  console.log(`Successfully added ${numRecords} records.`);
}

run();
