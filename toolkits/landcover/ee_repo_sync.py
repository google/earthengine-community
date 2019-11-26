#!/usr/bin/env python3
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
import os
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Temporary local directory where Git repository will be cloned.
WORK_PATH = '%s/.ee_repo_sync' % SCRIPT_DIR
GIT_BASE_URL = 'https://earthengine.googlesource.com'
ORIGINAL_REQUIRE_PATH = 'users/google/toolkits:landcover/'
SOURCE_PATHS = ['api.js', 'impl', 'examples']


def search_replace(start_path, ext, original, replacement):
    for dir_name, dirs, files in os.walk(start_path):
        if dir_name == '.git':
            continue
        for file in files:
            if not file.endswith(ext):
                continue
            path = os.path.join(dir_name, file)
            original_file = ''
            with open(path) as f:
                original_file = f.read()
            updated_file = original_file.replace(
                original, replacement)
            if (original_file != updated_file):
                with open(path, 'w') as f:
                    f.write(updated_file)


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

print('''
    NOTE: If you receive PERMISSION_DENIED errors, be sure you have access
    to the specified repo, and that you have logged in following instructions
    at https://www.googlesource.com/new-password and try again.
''')

# Build paths
repo = args.target_repo
target_path = args.target_path
repo_url = GIT_BASE_URL + '/' + repo
clone_path = os.path.expanduser(os.path.join(WORK_PATH, repo))
write_path = os.path.join(clone_path, target_path)
new_require_path = repo + ':'
if (target_path):
    new_require_path += target_path + '/'

# Clone or pull repo to home dir
if os.path.isdir(clone_path):
    print('%s exists. Pulling latest from remote.' % clone_path)
    subprocess.check_output(['git', '-C', clone_path, 'pull', '--quiet'])
else:
    print("%s doesn't already exist." % clone_path)
    subprocess.check_output(['git', 'clone', repo_url, clone_path])

subprocess.check_output(['mkdir', '-p', write_path])

# Copy selected files to local clone
for source in SOURCE_PATHS:
    subprocess.check_output(['rsync', '--archive', '--delete-excluded',
                             "--include='*.js'",
                             "--exclude='*'",
                             source,
                             write_path])

# Search and replace paths in source files
search_replace(write_path, '.js', ORIGINAL_REQUIRE_PATH, new_require_path)

# Commit and push changes
subprocess.check_output(
    ["git", "-C", clone_path, "add", clone_path])

# Only proceed if there are staged changes
if subprocess.run(["git", "-C", clone_path, "diff-index", "--quiet", "HEAD"]
                  ).returncode == 0:
    exit(0)

subprocess.check_output(["git", "-C", clone_path, "commit", "-m",
                         "Automated commit by ee_repo_sync.py"])
subprocess.check_output(["git", "-C", clone_path, "push"])
