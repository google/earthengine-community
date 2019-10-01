# Contributing to the Earth Engine Land Cover Toolkit

Thanks for taking time to contributing to the Land Cover Toolkit! Here are a few
instructions to make it easier to get started.

This guide assumes you have a recent version of Git installed on your
workstation, and are comfortable entering commands in a command-line or shell.

## First time setup

### 1. Read contribution guidelines

Make sure you've read and understood [How to Contribute][contribute] and have
accepted the appropriate CLA.

### 2. Set up local environment

These instructions only need to be followed once per development workstation:

1.  Install Node Version Manager (NVM)

    http://nvm.sh#install--update-script

2.  Install Node.js

        $ nvm install 10.16.2

3.  Install Jasmine test framework

        $ npm install --global jasmine

### 3. Project setup

Do this once to set up a local copy of the source code:

1.  Fork this repository into your own GitHub account and clone it to your
    workstation

    https://help.github.com/en/articles/fork-a-repo

2.  Download dependencies needed for running tests

        $ cd toolkits/landcover
        $ npm install

3.  Create an Earth Engine service account by following instructions at:

    https://developers.google.com/earth-engine/service_account

    Save the resulting private key JSON file to `test/.private-key.json`.

4.  Refresh list of Earth Engine algorithms needed for unit testing

        $ npm run update-algorithms

### 4. Get to work

#### Testing

After making changes, use the following commands to test your changes offline
locally (lint and unit tests) and against Earth Engine (integration tests).

*   Run lint checks

        $ npm run lint

*   Format code and fix lint errors

        $ npm run fix

*   Run unit tests

        $ npm run test:unit

*   Run integration tests

        $ npm run test:int

*   Run all tests

        $ npm run test

*   Check unit test coverage

        $ npm run coverage

*   See coverage report in browser

        $ npm run open-coverage

More details on testing, including methodology and debugging, can be found in
[test/README.md](test/README.md).

#### Submitting changes

On each change, commit and push to GitHub:

      $ git commit -m '<Commit message>'
      $ git push

Most modern text editors and IDEs can do this for you.

Once your changes are ready for review, follow these instructions:

    https://help.github.com/en/articles/creating-a-pull-request

You'll then be assigned a reviewer who will guide you through the rest of the
process.

[contribute]: https://github.com/google/earthengine-community/blob/master/CONTRIBUTING.md
