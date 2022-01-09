const program = require('commander');
const { bold, red, yellow } = require('chalk');
const _package = require('../package.json');
const bullets = require('./bullets');
const unext = require('./unext');

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
            .usage(bold.white(`\nnpx ${_package.name} <SCRIPT> [-p <ARGUMENT>]`));

        scripts.forEach(script => {
            program
                .command(unext(script))
                .action((arg, options) => resolve([script, args.slice(3)]));
        });

        program
            .parse(args);

        const commands = args.slice(2);

        if (!commands.length) {
            program.help();
            reject();
            return;
        }

        reject(
            [
                red(`Sorry, I don't have any "${commands[0]}" script.`),
                'Try one of these:',
                yellow(bullets(scripts)),
                '',
            ].join('\n')
        );
        return;
    });
};
