module.exports = function npmPublish() {
    return new Promise((resolve, reject) => {
        if (this.constructor.name !== 'EventEmitter') {
            const error = new TypeError(`'npmPublish' must be call on an NPM instance (EventEmitter), was called on ${this.constructor.name}`);
            reject();
        }

        this.publish((error, result) => {
            if (error) {
                reject(error);

                return;
            }

            resolve();
        });
    });
};
