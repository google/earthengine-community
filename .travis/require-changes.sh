#!/bin/bash

set -ev

echo Range: ${TRAVIS_COMMIT_RANGE}
echo git diff --name-only ${TRAVIS_BRANCH}...${TRAVIS_COMMIT}
git diff --name-only ${TRAVIS_BRANCH}...${TRAVIS_COMMIT}
