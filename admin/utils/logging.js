'use strict';

var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var assign = require('lodash/assign');
var nconf = require('./conf');
var loggerConfig = nconf.get('logger');

var prettyStdErr = new PrettyStream({useColor: false});
prettyStdErr.pipe(process.stderr);

function getLogger(component, opts) {
  return bunyan.createLogger(assign({
    name: 'Acme Bank',
    file: component,
    streams: [
      {
        level: loggerConfig.level,
        stream: process.stdout,
      },
      {
        level: 'error',
        type: 'raw',
        stream: prettyStdErr,
      },
    ],
  }, opts));
}

module.exports.getLogger = getLogger;
