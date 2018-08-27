module.exports = (testing = '', slack = {}) => new Promise(
    (resolve, reject) => require('published')
        ({
            testing: testing.toLowerCase() === 'testing',
            slack: Object.assign({webhook: process.env.SLACK_WEBHOOK}, slack)
        })
        .then(resolve)
        .catch(reject)
    );
