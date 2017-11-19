#!/bin/bash

prefix=$1

[ -z $prefix ] && echo "Please supply a prefix (e.g. \"npx ndsh has-prefix @my-org/\")" && exit 1

package_name=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')

if [[ $package_name != $1* ]]; then
  echo "The package name doesn't start with $1 (${package_name}). You can not proceed"
  exit 1
fi

echo "Package prefixed with $1. You may proceed"
exit 0
