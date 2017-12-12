require('colors');

module.exports = (testing = '') => new Promise((resolve, reject) => {
    const npm = require('npm');
    const isTest = testing.toLowerCase() === 'testing';

    if (isTest) {
        console.log(`In "${'testing'.bold}" mode I\'m only telling you what I ${'intent to do '.bold}`.yellow);
    }

    npm.load(async(error, instance) => {
        if (error) {
            reject(error);
            return;
        }

        try {
            const {
                version,
                name,
            } = await require('package-data')();

            const {
                branch,
                author,
                commitMessage,
            } = require('git-repo-info')();

            let tag;

            // master branch pushes "latest", others push as branch name
            if (branch === 'master') {
                if (!cleanSemver(version)) {
                    throw new Error(`Publishing a \"latest\" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version.underline}.`.red.bold);
                }

                tag = 'latest';
            } else {
                tag = branch;
            }

            const npmViewVersion = require('../lib/npm-view-version');
            const published = await npmViewVersion.call(instance, `${name}@${version}`) === version;
            const released = await npmViewVersion.call(instance, `${name}@${tag}`) === version;

            // Version not published yet - let's publish it
            if (!published) {
                const message = `Publish version ${version.underline} to tag ${tag.underline}`;

                if (isTest) {
                    resolve(message);
                    return;
                }

                const npmPublish = require('../lib/npm-publish');

                await setTag(tag);
                await npmPublish.call(instance, tag);
                resolve(message);
                await setTag('next');
                return;
            }

            // Version published but tag isn't pointing to it - get pointing!
            if (!released) {
                const message = `Set tag ${tag.underline} to version ${version.underline}`;

                if (isTest) {
                    resolve(message);
                    return;
                }

                const npmSetTag = require('../lib/npm-set-tag');

                await npmSetTag.call(instance, `${name}@${version}`, tag);
                resolve(message);
                return;
            }

            // Version published, Tag's already pointing to it. Nothing to do but sit back and sip on Margaritas
            const message = `Do nothing. Tag ${tag.underline} is already set to version ${version.underline}`;

            resolve(message);
            return;

        } catch (error) {
            reject(error);
        }
    });
});

async function setTag(tag) {
    const editPackage = require('edit-package');

    await editPackage({
        publishConfig: {
            tag,
            'tag-version-prefix': '',
        }
    })
}

// Semver has no a pre-release tag
function cleanSemver(version) {
    return /^\d{1,}.\d{1,}.\d{1,}$/.test(version);
}
