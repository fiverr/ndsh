module.exports = function npmViewVersion(module) {
    return new Promise((resolve, reject) => {
        if (this.constructor.name !== 'EventEmitter') {
            const error = new TypeError(`'npmViewVersion' must be call on an NPM instance (EventEmitter), was called on ${this.constructor.name}`);
            reject(error);
            return;
        }

        this.view(module, 'version', (error, result) => {
            if (error) {
                reject(error);

                return;
            }

            if (!Object.keys(result).length) {
                resolve(null);

                return;
            }

            resolve(result[Object.keys(result)[0]].version);
        });
    });
};
