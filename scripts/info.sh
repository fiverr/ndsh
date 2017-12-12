version=$(echo $(node -p -e "require('./package.json').version"));

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
