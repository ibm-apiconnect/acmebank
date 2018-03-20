'use strict';

var nconf = require('nconf');
var ymlFormat = require('nconf-yaml');
var path = require('path');

var envPath = path.resolve(__dirname, '..', '.env.yaml');
var basePath = path.resolve(__dirname, '../configs', 'config-base.yaml');

nconf.argv()
  .env({separator: '__'})
  .file('defaults', {file: envPath, format: ymlFormat})
  .file('override', {file: basePath, format: ymlFormat});

nconf.loadFilesSync();

module.exports = nconf;
