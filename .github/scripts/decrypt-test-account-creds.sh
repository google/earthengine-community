#!/bin/sh
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

echo "Passphrase: ${TEST_ACCOUNT_CREDS_PASSPHRASE}"
gpg --quiet --batch --yes --decrypt \
  --passphrase="${TEST_ACCOUNT_CREDS_PASSPHRASE}" \
  --output "$1" \
  "${GITHUB_WORKSPACE}/.github/secrets/test-account-creds.json.gpg"