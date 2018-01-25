require('colors');
const interpolate = require('@fiverr/futile/lib/interpolator')(/\${([^{}]*)}/gm);

const webhookNotifier = require('../lib/webhook-notifier');
const {
    cleanSemver,
    extractPreReleaseTag,
    branch,
    author,
    sha,
} = require('../lib/env-getters');

const RELEASE_CANDIDATES = [
    'rc',
    'releasecandidate',
    'release-candidate',
];

const COLOR_OKAY = '#27ae60'; // Nephritis
const COLOR_NEUTRAL = '#7f8c8d'; // Asbestos
const COLOR_ERROR = '#c0392b'; // Pomegranate

const convertKeys = (data, convert = (thing) => thing) => Object.keys(data).reduce((collector, key) => {
    collector[key] = convert(data[key]);

    return collector;
}, {});

const messageBuilder = (msg, data) => ({
    plain: interpolate(msg, convertKeys(data)),
    toString: () => interpolate(msg, convertKeys(data)),
    console: interpolate(msg, convertKeys(data, (item => item.underline))),
    md: interpolate(msg, convertKeys(data, (item => `*${item}*`))),
});

const SMILEYS = [
    ':smiley:',
    ':grinning:',
    ':wink:',
    ':blush:',
    ':sunglasses:',
    ':yum:',
    ':hugging_face:',
    ':monkey:',
    ':sunflower:',
    ':birthday:',
    ':beers:',
    ':medal:',
    ':champagne:',
    ':confetti_ball:',
];

const smile = () => SMILEYS[Math.floor(Math.random() * SMILEYS.length)];

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

        const packageData = await require('package-data')();

        const {
            name,
        } = packageData;

        let {
            version,
        } = packageData;

        const title = (() => {
            if (name) {
                return `${name} package`;
            }

            if (process.env.CIRCLE_PROJECT_REPONAME) {
                return `${process.env.CIRCLE_PROJECT_REPONAME} project`;
            }

            return 'Unknown process';
        })();

        try {
            const title_link = name ? `https://www.npmjs.com/package/${name}` : undefined;

            let tag;

            // master branch pushes "latest", others push as branch name
            if (branch() === 'master') {
                if (!cleanSemver(version)) {
                    throw new Error(`Publishing a \"latest\" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version.underline}.`.red.bold);
                }

                tag = 'latest';
            } else {
                const preReleaseTag = extractPreReleaseTag(version);

                if (!RELEASE_CANDIDATES.some(term => preReleaseTag.toLowerCase().includes(term))) {
                    resolve(`${version.underline} is not declared as a release candidate ("rc" in version's pre release part, e.g. 1.2.0-rc.1). ${'Not publishing'.underline}.`);
                    return;
                }

                tag = branch().replace(/[^\w-_]/g, '-');
            }

            version = tag === 'latest' ? version : `${version}-${sha()}`;

            const npmExists = require('../lib/npm-exists');
            const exists = await npmExists.call(instance, name);

            const npmViewVersion = require('../lib/npm-view-version');
            const published = exists && await npmViewVersion.call(instance, `${name}@${version}`) === version;
            const released = exists && await npmViewVersion.call(instance, `${name}@${tag}`) === version;

            // Version not published yet - let's publish it
            if (!published) {
                const message = messageBuilder(`${exists ? '' : `${name} package doesn't exist yet. `}Publish version \${version} to tag \${tag}`, {version, tag});

                if (isTest) {
                    resolve(message.console);
                    return;
                }

                const npmPublish = require('../lib/npm-publish');

                await setTag(tag);
                await setVersion(version);
                await npmPublish.call(instance, tag);
                await require('../lib/git-tag')(version);
                await webhook(message.md, {title, title_link, color: COLOR_OKAY});
                await resetPackage(packageData);
                resolve(message.console);
                return;
            }

            // Version published but tag isn't pointing to it - get pointing!
            if (!released) {
                const message = messageBuilder('Set tag ${tag} to version ${version}', {tag, version});

                if (isTest) {
                    resolve(message.console);
                    return;
                }

                const npmSetTag = require('../lib/npm-set-tag');

                await npmSetTag.call(instance, `${name}@${version}`, tag);
                await webhook(message.md, {title, title_link, color: COLOR_NEUTRAL});
                resolve(message.console);
                return;
            }

            // Version published, Tag's already pointing to it. Nothing to do but sit back and sip on Margaritas
            const message = messageBuilder('Do nothing. Tag ${tag} is already set to version ${version}', {tag, version});

            resolve(message.console);
            return;

        } catch (error) {
            await webhook(`Error in publishing flow: ${error}`, {title, color: COLOR_ERROR});
            reject(error);
        }
    });
});

function webhook(text, {channel = '#publish', color = '#9b59b6', title = '', title_link} = {}) {
    const attachment = {
        fallback: `${title}: package was automatically published`,
        color,
        author_name: author(),
        title,
        title_link,
        pretext: `Automated operation triggered by *${author()}*`,
        text,
        mrkdwn_in: ['text', 'pretext'],
    };

    return webhookNotifier(
        {
            attachments: [attachment],
            channel,
            username: 'The Publisher',
            icon_emoji: smile(),
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
    });
}

async function setVersion(version) {
    const editPackage = require('edit-package');

    await editPackage({
        version
    });
}

async function resetPackage(packageData) {
    const editPackage = require('edit-package');

    await editPackage(packageData);
}

