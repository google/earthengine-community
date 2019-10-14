#!/bin/bash

set -ev

echo git diff --name-only ${TRAVIS_BRANCH}...${TRAVIS_COMMIT}
git diff --name-only ${TRAVIS_BRANCH}...${TRAVIS_COMMIT}
