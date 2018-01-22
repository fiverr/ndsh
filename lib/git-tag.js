const gitTag = require('git-tag')();
const { gitRepoInfo } = require('../lib/env-getters');

module.exports = (tag) => new Promise((resolve, reject) => {
    const { commitMessage } = gitRepoInfo;

    if (!tag) {
        reject(new Error('No tag was supplied'));
    }

    if (tag === gitRepoInfo.tag) {
        resolve();
    }

    gitTag.create(
        tag,
        commitMessage,
        (error, response) => {
            if (error) {
                reject(error);
            }

            resolve(response);
        }
    );
});
