require('colors');
const webhookNotifier = require('../lib/webhook-notifier');
const {
    cleanSemver,
    extractPreReleaseTag,
    branch,
    author,
    gitRepoInfo,
} = require('../lib/env-getters');

const RELEASE_CANDIDATES = [
    'rc',
    'releasecandidate',
    'release-candidate',
];

const COLOR_OKAY = '#27ae60'; // Nephritis
const COLOR_NEUTRAL = '#7f8c8d'; // Asbestos
const COLOR_ERROR = '#c0392b'; // Pomegranate

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

            const title = (() => {
                if (name) {
                    return `${name} package`;
                }

                if (process.env.CIRCLE_PROJECT_REPONAME) {
                    return `${process.env.CIRCLE_PROJECT_REPONAME} project`;
                }

                return 'Unknown process';
            })();

            let tag;

            // master branch pushes "latest", others push as branch name
            if (branch() === 'master') {
                if (!cleanSemver(version)) {
                    throw new Error(`Publishing a \"latest\" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version.underline}.`.red.bold);
                }

                tag = 'latest';
            } else {
                const preReleaseTag = extractPreReleaseTag(version);

                if (preReleaseTag && !RELEASE_CANDIDATES.some(term => preReleaseTag.toLowerCase().includes(term))) {
                    resolve(`${version.underline} is not declared as a release candidate ("rc" in version's pre release part, e.g. 1.2.0-rc.1). ${'Not publishing'.underline}.`);
                    return;
                }

                tag = branch().replace(/[^\w-_]/g, '-');
            }

            const npmExists = require('../lib/npm-exists');
            const exists = await npmExists.call(instance, name);

            const npmViewVersion = require('../lib/npm-view-version');
            const published = exists && await npmViewVersion.call(instance, `${name}@${version}`) === version;
            const released = exists && await npmViewVersion.call(instance, `${name}@${tag}`) === version;

            // Version not published yet - let's publish it
            if (!published) {
                const message = `${exists ? '' : `${name} package doesn't exist yet. `}Publish version ${version.underline} to tag ${tag.underline}`;

                if (isTest) {
                    resolve(message);
                    return;
                }

                const npmPublish = require('../lib/npm-publish');

                await setTag(tag);
                await npmPublish.call(instance, tag);
                await webhook(message, {title, color: COLOR_OKAY});
                await setTag('next');
                resolve(message);
                return;
            }

            // Version published but tag isn't pointing to it - get pointing!
            if (!released) {
                const message = `Set tag ${tag.underline} to version ${version.underline}.`;

                if (isTest) {
                    resolve(message);
                    return;
                }

                const npmSetTag = require('../lib/npm-set-tag');

                await npmSetTag.call(instance, `${name}@${version}`, tag);
                await webhook(message, {title, color: COLOR_NEUTRAL});
                resolve(message);
                return;
            }

            // Version published, Tag's already pointing to it. Nothing to do but sit back and sip on Margaritas
            const message = `Do nothing. Tag ${tag.underline} is already set to version ${version.underline}`;
            resolve(message);
            return;

        } catch (error) {
            await webhook(`Error in publishing flow: ${error}`, {title, color: COLOR_ERROR});
            reject(error);
        }
    });
});

function webhook(message, {channel = '#publish', color = '#9b59b6', title = ''} = {}) {
    return webhookNotifier(
        {
            attachments: [
                {
                    fallback: `${title}: package was automatically published`,
                    color,
                    author_name: `Automated operation triggered by ${author()}`,
                    title,
                    text: message.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ''),
                    username: 'Publishbot',
                    icon_emoji: ':npm:',
                }
            ],
            channel,
        }
    )
}

async function setTag(tag) {
    const editPackage = require('edit-package');

    await editPackage({
        publishConfig: {
            tag,
            'tag-version-prefix': '',
        }
    })
}
