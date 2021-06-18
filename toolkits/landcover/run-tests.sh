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

# Install dependencies.
npm install

# Run lint and unit tests.
# npm run lint
# npm run test:unit

# Bail out if service key not available.
if [[ -e "${SERVICE_ACCOUNT_CREDENTIALS}" ]]; then
  echo "SERVICE_ACCOUNT_CREDENTIALS undefined."
  exit 1

 # Write credentials to file and run integration tests.
echo "${SERVICE_ACCOUNT_CREDENTIALS}" > test/.private-key.json 
npm run test:int
