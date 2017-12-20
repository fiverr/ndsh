// Semver has no a pre-release tag
function cleanSemver(version) {
    return /^\d{1,}.\d{1,}.\d{1,}$/.test(version);
}

// Get the pre release tag from the complete version
function extractPreReleaseTag(version) {
    return version.replace(/^\d{1,}.\d{1,}.\d{1,}-?/, '');
}

function branch() {
    return process.env.CIRCLE_BRANCH || gitRepoInfo().branch;
}

function author() {
    return process.env.CIRCLE_USERNAME || gitRepoInfo().author || 'Publishing bot :robot_face:';
}

let _gitRepoInfo;
function gitRepoInfo() {
    return _gitRepoInfo = _gitRepoInfo || require('git-repo-info')();
}

module.exports = {
    cleanSemver,
    extractPreReleaseTag,
    branch,
    author,
    gitRepoInfo,
};
