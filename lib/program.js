const program = require('commander');
const _package = require('../package.json');
const bullets = require('./bullets');
const unext = require('./unext');
require('colors')

/**
 * Tries to find the script and resolves with the found script name
 * @param  {String} scripts
 * @return {Promise}
 */
module.exports = function _program(scripts) {
    return new Promise((resolve, reject) => {
        const args = process.argv;

        program
            .version(_package.version)
            .description('Runs shell scripts')
            .usage(`\nnpx ${_package.name} <SCRIPT> [-p <ARGUMENT>]`.bold.white);

        scripts.forEach(script => {
            program
                .command(unext(script))
                .action((arg, options) => resolve([script, args.slice(3)]));
        });

        program
            .parse(args);

        const command = args.slice(2);

        if (!command.length) {
            program.help();
            reject();
            return;
        }

        reject(
            [
                `Sorry, I don't have any "${command}" script.`.red,
                'Try one of these:',
                bullets(scripts).yellow,
                '',
            ].join('\n')
        );
        return;
    });
}
