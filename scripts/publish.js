module.exports = (testing = '') => new Promise(
    (resolve, reject) => require('published')
        ({testing: testing.toLowerCase() === 'testing'})
        .then(resolve)
        .catch(reject)
    );
