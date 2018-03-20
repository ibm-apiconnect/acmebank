/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const commonValues = {
  mediumGrey: '#9B9B9B',
  greyBackground: '#f5f5f5',
  white: '#ffffff',
  black: '#000000',
  goodGreen: '#37a500',
  badRed: '#a30303',
  navBackground: '#575757',
  navHeaderBackground: '#8B8B8B',
};

const designPallete = {
  background: '#7cc326',
  backgroundGradient: ['#11227A', '#49C4FF'],
  buttonBackground: '#5466F7',
  buttonDisabledBackground: '#cccccc',
  buttonText: '#ffffff',
  altBackground: '#EDF3FF',
  altText: '#1A2778',
  investmentBackgroundGradient: ['#3F53C6', '#223287'],
  futureInvestments: [
    {
      background: '#c65de8',
      backgroundGradient: ['#c65de8', '#653bce'],
      text: '#ffffff',
      buttonBackground: '#3373BD',
    },
    {
      background: '#01CFA1',
      backgroundGradient: ['#34d89e', '#32b7b4'],
      text: '#ffffff',
      buttonBackground: '#00B48C',
    },
    {
      background: '#FAD046',
      backgroundGradient: ['#f9a772', '#f76394'],
      text: '#ffffff',
      buttonBackground: '#FABD0F',
    },
  ],
  ...commonValues,
};


export default designPallete;