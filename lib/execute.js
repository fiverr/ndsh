const exec = require('child_process').exec;

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
                    console.error(stdout);
                    reject(`exec error: ${error}`);
                    return;
                }

                if (stderr) {
                    console.error(stderr);
                    reject(`stderr:\n${stderr}`);
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
