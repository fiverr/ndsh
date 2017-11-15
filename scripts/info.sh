version=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]');

release=${version%-*}
prerelease=${version#$release}

npmuser=$(npm whoami)
branchname=$(git rev-parse --abbrev-ref HEAD)

output="Module veriosn ${version}"
[[ ! -z $prerelease ]] && output="${output} (Release: ${release}, prerelease: ${prerelease})"
output="${output} from branch ${branchname}"
output="${output} as ${npmuser}"
echo $output

exit 0
