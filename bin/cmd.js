#!/usr/bin/env node

var argv = require('yargs')
    .usage('Usage: $0 <file>')
    .demand(1)
    .argv;

var file = argv._[0];

require('../server')(file);
