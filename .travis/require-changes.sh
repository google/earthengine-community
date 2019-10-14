#!/bin/bash

set -ev

git diff --name-only ${TRAVIS_BRANCH}...${TRAVIS_COMMIT}
