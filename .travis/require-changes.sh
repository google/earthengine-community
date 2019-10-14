#!/bin/bash

# Exit on error.
set -ev

# Path to check for changes.
DIR="$1"

# Changed files in this pull request in the specified dir.
CHANGES=`git diff --name-only ${TRAVIS_COMMIT_RANGE} $DIR`

# Fail if no changes, causing travis.yml to skip running tests.
if [ -z "$CHANGES" ]; then
  echo "No changes in $DIR, skipping tests..."
  exit 1
fi
