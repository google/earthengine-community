#!/bin/bash
# Copyright 2019 Google LLC
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

DIR="toolkits/landcover"
KEY_FILE_ENC="test/.private-key.json.enc"
KEY_FILE="test/.private-key.json.enc"
KEY="${encrypted_44af26ab0da9_key}"
IV="${encrypted_44af26ab0da9_iv}"

# For PRs, skip tests if no changes.
if [[ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]]; then
  bash ./.travis/require-changes.sh "${DIR}" || exit 0
fi

# Setup/
cd "${DIR}"
npm install

# Run lint and unit tests.
npm run lint
npm run test:unit

# Run integration tests if private keys set in environment.
if [[ -n "${KEY}" ]] && [[ -n "${IV}" ]]; then
  openssl aes-256-cbc -K "${KEY}" -iv "${IV}" -in "${KEY_FILE_ENC} -out "${KEY_FILE} -d
  npm run test:int
else
  echo "No keys; skipping integration tests."
fi
