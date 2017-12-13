const exec = require('child_process').exec;

/**
 * Executes the script and resolves with the output message
 * @param  {String} script Route to script file
 * @return {Promise}
 */
module.exports = function execute(expression) {
    const args = expression.split(' ');
    const script = args.shift();
    const ext = script.split('.').pop();

    if (typeof callbacks[ext] !== 'function') {
        throw new Error(`Can not handle "${ext}" files`);
    }

    return callbacks[ext](script, args);
};

const callbacks = {};

callbacks.js = (script, args) => require(script)(...args);

callbacks.sh = (script, args) => {
    return new Promise((resolve, reject) => {
        const child = exec(
            [script, ...args].join(' '),
            (error, stdout, stderr) => {
                if (error) {
                    console.error(stdout);
                    reject(`exec error: ${error}`);
                    return;
                }

                if (stderr) {
                    console.error(stderr);
                    console.error(stdout);
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
