#!/usr/bin/env python
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
"""Pushes required toolkit source to an Earth Engine repo."""

import argparse
import subprocess
import os

WORK_PATH = '~/.ee_repo_sync'
GIT_BASE_URL = 'https://earthengine.googlesource.com'
ORIGINAL_REQUIRE_PATH = 'users/google/toolkits:landcover/'
SOURCE_PATHS = ['api.js', 'impl', 'examples']

# Declare args and help text
parser = argparse.ArgumentParser(
    description='''
    Pushes required toolkit source to an Earth Engine repo, updating require()
    paths as necessary, overwriting remote changes.
    Example usage:
    ./ee_repo_sync.py
      --target_repo=users/%s/toolkits
      --target_path=landcover
    ''' % os.getlogin())
parser.add_argument('--target_repo', required=True,
                    help='Destination Earth Engine repo path (required)')
parser.add_argument('--target_path',
                    help='Destination path in target repo (default: root)')
args = parser.parse_args()

repo = args.target_repo
target_path = args.target_path
repo_url = GIT_BASE_URL + '/' + repo
clone_path = os.path.expanduser(os.path.join(WORK_PATH, repo))
write_path = os.path.join(clone_path, target_path)
new_require_path = repo + ":"
if (target_path):
    new_require_path += target_path + "/"

# Clone or pull repo to home dir
if not os.path.isdir(clone_path):
    subprocess.call(["git", "clone", repo_url, clone_path])
else:
    subprocess.call(["git", "-C", clone_path, "pull"])

subprocess.call(["mkdir", "-p", write_path])

# Copy selected files to local clone
for source in SOURCE_PATHS:
    subprocess.call(['rsync', '--archive', '--delete-excluded',
                     "--include='*.js'",
                     "--exclude='*'",
                     source,
                     write_path])

# Search and replace paths
os.system("find %s -name '*.js' -exec sed -i '' 's|%s|%s|g' {} \;" %
          (write_path, ORIGINAL_REQUIRE_PATH, new_require_path))

# Commit and push changes
subprocess.call(["git", "-C", clone_path, "add", clone_path])
subprocess.call(["git", "-C", clone_path, "commit", "-m",
                 "Automated commit by ee_repo_sync.py"])
subprocess.call(["git", "-C", clone_path, "push"])
