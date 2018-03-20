/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import ThemeColors from './ThemeColors';

const CommonStyles = {
  content: {
    backgroundColor: ThemeColors.white,
    padding: 20,
  },
  contentSpacer: {
    marginTop: 10,
  },
  additionalContent: {
    marginTop: 10,
  },
  logoutText: {
    fontSize: 14,
  },
  nextButton: {
    width: '100%',
    backgroundColor: ThemeColors.buttonBackground,
    justifyContent: 'center',
    borderRadius: 0,
  },
  nextButtonDisabled: {
    width: '100%',
    backgroundColor: ThemeColors.buttonDisabledBackground,
    justifyContent: 'center',
    borderRadius: 0,
  },
  nextButtonText: {
    color: ThemeColors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggle: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderColor: ThemeColors.altText,
  },
  toggleButton: {
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonSelected: {
    backgroundColor: ThemeColors.altBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentInfo: {
    marginLeft: 20,
  },
  fullPageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  fullWidth: {
    width: '100%',
  },
};

export default CommonStyles;