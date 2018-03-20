/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import config from 'react-global-configuration';
import { parse as _urlParse, format as _urlFormat } from 'url';
import { parse as _qsParse, stringify as _qsStringify } from 'querystring';

export function getRequestDefaults (url, query) {
  let apiServer = config.get('apiServer');

  let options = {
    method: 'get',
    credentials: 'include',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
  };
    
  options.url = setUrlParams(url, apiServer, query);

  return options;
}

export function handleErrors (response) {
  if (response.ok) {
    return response;
  }

  return response.json()
        .then(json => {
          let err;
          if (json.error) {
            err = new Error(json.error.message);
            err.status = response.status;
            err.reason = response.statusText;
            throw err;
          }

          return response.text();
        })
        .then(text => {
          let err = new Error(text);
          err.status = response.status;
          err.reason = response.statusText;
          throw err;
        });
}

export function setUrlParams (url, baseUrl, queryParams) {
    // Get url and baseUrl as objects
  let origUrl = _urlParse(baseUrl || '');
  let relativeUrl = _urlParse(url);

  let newUrl = Object.assign(origUrl, {
    href: null,
    path: null,
    pathname: (origUrl.pathname === '/') ? relativeUrl.pathname : `${origUrl.pathname || ''}${relativeUrl.pathname}`,
    search: queryParams ? _qsStringify(queryParams) : null,
  });

  return _urlFormat(newUrl);
}

export function getQueryParam (key, queryString = window.location.search) {
  if (queryString.includes('?')) {
    queryString = queryString.substr(queryString.indexOf('?') + 1);
  }

  let queryObject = _qsParse(queryString);

  return queryObject[key] || '';
}
