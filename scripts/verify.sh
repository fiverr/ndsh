#!/bin/bash

# ######################################################################## #
# This is the only user that's allowed to publish non pre-release versions #
# ######################################################################## #
ALLOWED_USER=$1

if [ -z $ALLOWED_USER ]; then
	echo "Please pass a username"
	exit 1
fi

# ######################### #
# Get NPM username by token #
# ######################### #
npmuser=$(npm whoami)

######################################### #
# Only ALLOWED_USER is allowed to publish #
# ####################################### #
if [ "$npmuser" != "$ALLOWED_USER" ]; then
	echo "You are not $ALLOWED_USER, you can not proceed"
	exit 1
fi

echo "Go ahead, $npmuser, you can do things"
exit 0
