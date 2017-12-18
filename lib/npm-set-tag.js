module.exports = function npmSetTag(module, tag) {
    return new Promise((resolve, reject) => {
        if (this.constructor.name !== 'EventEmitter') {
            const error = new TypeError(`'npmSetTag' must be call on an NPM instance (EventEmitter), was called on ${this.constructor.name}`);
            reject(error);
            return;
        }

        this.distTag('set', module, tag, (error, result) => {
            if (error) {
                reject(error);

                return;
            }

            resolve();
        });
    });
};
