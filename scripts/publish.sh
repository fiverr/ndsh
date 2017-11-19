#!/bin/bash

testing=$1

# #################################### #
# Get version number from package.json #
# #################################### #
version=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]');
name=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')

# ########## #
# Git branch #
# ########## #
branchname=$(git rev-parse --abbrev-ref HEAD)

# ###################################################### #
# master brach pushes latest, others push as branch name #
# ###################################################### #
if [ "$branchname" = "master" ]; then
	if [[ ! $version =~ [[:digit:]]{1,}\.[[:digit:]]{1,}\.[[:digit:]]{1,}$ ]]; then
		echo "Publishing a \"latest\" version is not allowed using a pre-release suffix."
		echo "Remove the pre-release from $version."
		exit 1
	fi

	tag="latest"
else
	tag="$branchname"
fi

# #################################################### #
# Find out if the current version is already published #
# #################################################### #
published=$(npm view ${name}@${version} version)
released=$(npm view ${name}@${tag} version)

[ "$testing" = "testing" ] && echo -e "Testing mode.\nEchoing the actions instead of performing them:\n"

if [[ -z "$published" ]]; then
	if [ "$testing" = "testing" ]; then
		echo "npm publish --tag ${tag}"
	else
		echo "======================================================================"
		echo -e "\tPublishing version ${version} as tag ${tag}"
		echo "======================================================================"

		eval "npm publish --tag ${tag}"
	fi
elif [ ! "$released" = "$version" ]; then
	if [ "$testing" = "testing" ]; then
		echo "npm dist-tag add ${name}@${version} ${tag}"
	else
		echo "======================================================================"
		echo -e "\tSetting tag ${tag} to ${version}"
		echo "======================================================================"

		eval "npm dist-tag add ${name}@${version} ${tag}"
	fi
else
	if [ "$testing" = "testing" ]; then
		echo "Doing nothing"
	else
		echo "======================================================================"
		echo -e "\tNo action required."
		echo -e "\ttag ${tag} is already set to ${version}"
		echo "======================================================================"
	fi
fi

exit 0
