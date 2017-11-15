const fs = require('fs');

/**
 * List files in a directory
 * @param  {String} path
 * @return {Array}
 */
module.exports = function ls (path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, items) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(items);
        });
    });
};
