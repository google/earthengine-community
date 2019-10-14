#!/bin/bash

set -ev

git diff --name-only ${TRAVIS_COMMIT_RANGE}
DIR="$1"
CHANGES=`git diff --name-only ${TRAVIS_COMMIT_RANGE} $DIR`

if [ -z "$CHANGES" ]; then
  echo "No changes in $DIR"
  exit 1
fi
