#!/bin/sh

raw=$(git branch -r --contains $1)
branch=${raw##*/} || ""

echo "TAG_BRANCH=$branch" >> $GITHUB_ENV