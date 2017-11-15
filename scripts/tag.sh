#!/bin/bash

# #################################### #
# Get version number from package.json #
# #################################### #
version=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]');

# ################### #
# Last commit message #
# ################### #
message=$(git log -1 --pretty=%B)

echo "Creating tag ${version} with message \"${message}\" and pushing upstream"

eval "git tag -a ${version} -m \"${message}\""
eval "git push origin refs/tags/${version}"
