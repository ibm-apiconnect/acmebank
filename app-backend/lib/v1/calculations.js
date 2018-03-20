/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

async function generateSuggestions(savingsRatio, debtToIncomeRatio, creditScore) {
  let savings = (savingsRatio <= .25) ? {
    status: 'good',
    message: 'The amount needed to save should not be a problem with your income.',
  } : {
    status: 'bad',
    message: 'You should keep your projected savings below 25% of your income.',
  } ;
  let debtToIncome = (debtToIncomeRatio <= .20) ? {
    status: 'good',
    message: 'Your current amount of debt should easily allow you to get a loan.',
  } : {
    status: 'bad',
    message: 'You will need to pay down some of your existing debt before applying for a loan.',
  } ;
  let credit = (creditScore >= 700) ? {
    status: 'good',
    message: 'You should not have any issues getting a loan with your credit score.',
  } : {
    status: 'bad',
    message: 'Raising your credit score to above 700 would help when applying for a loan.',
  } ;
  return {
    savings,
    debtToIncome,
    credit,
  };
}

module.exports = {
  generateSuggestions,
};
