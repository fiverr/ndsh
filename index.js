#!/usr/bin/env node

require('colors');
const ls = require('./lib/ls');
const program = require('./lib/program');
const execute = require('./lib/execute');

ls(`${__dirname}/scripts`)
    // .then(scripts => scripts.map(unext))
    .then(scripts => program(scripts))
    .then(([script, args]) => execute(`${__dirname}/scripts/${script} ${args.join(' ')}`))
    .then((message, exitCode) => {
        console.log((message || '').toString().green.bold);
        process.exit(exitCode);
    })
    .catch(error => {
        if (error) {
            console.error(error);
        }
        process.exit(1);
    });
