#!/bin/bash
# Copyright 2019 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Exit on error.
set -e

# Path to check for changes.
DIR="$1"

echo "Checking for changes in ${DIR} in commits ${TRAVIS_COMMIT_RANGE}"

# Changed files in this pull request in the specified dir.
CHANGES=`git diff --name-only ${TRAVIS_COMMIT_RANGE} ${DIR}`

# Fail if no changes, causing travis.yml to skip running tests.
if [ -z "$CHANGES" ]; then
  echo "No changes in ${DIR}, skipping tests..."
  exit 1
else
  echo "Changed files:"
  echo "${CHANGES}"
fi
