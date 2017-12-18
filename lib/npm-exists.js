module.exports = function npmExists(module) {
    return new Promise((resolve, reject) => {
        if (this.constructor.name !== 'EventEmitter') {
            const error = new TypeError(`'npmExists' must be call on an NPM instance (EventEmitter), was called on ${this.constructor.name}`);
            reject(error);
            return;
        }

        this.view(module, 'name', (error, result) => resolve(!error));
    });
};
