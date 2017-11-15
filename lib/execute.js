const exec = require('child_process').exec;
require('colors');

/**
 * Executes the script and resolves with the output message
 * @param  {String} script Route to script file
 * @return {Promise}
 */
module.exports = function execute(script) {
    return new Promise((resolve, reject) => {
        const child = exec(
            script,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(stdout.red.bold);
                    reject(`exec error: ${error}`);
                    return;
                }

                if (stderr) {
                    reject(`stderr:\n${stderr.red.bold}`);
                    return;
                }

                resolve(
                    stdout.trim(),
                    child.exitCode
                );
            }
        );
    });
};
