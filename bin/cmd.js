#!/usr/bin/env node

var argv = require('yargs')
    .usage('Usage: $0 <file>')
    .demand(1)
    .example('$0 dist/bundle.js')
    .option('p', {
      alias: 'port',
      describe: 'Port that would be used for establishing WebSocket connection',
    })
    .version(function getVersion() {
      return require('../package.json').version;
    })
    .alias('v', 'version')
    .argv;

require('../server')(argv._, argv);
