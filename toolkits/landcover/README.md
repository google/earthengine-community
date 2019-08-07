# EE LCT Dev Docs [TEMPORARY INTERNAL]

Instructions point to internal URLs and temporary repo. They'll be updated
accordingly before open sourcing.

We'll also want to only make api.js and impl/ available via code editor if
possible.

## Using from Earth Engine Code Editor

    var lct = require('users/gmiceli/ee-lct/api.js')

## Local dev environment setup

Once per dev workstation:

1.  Install NVM: http://nvm.sh#install--update-script

1.  Install Nodejs

        nvm install 8.16.0

1.  Install Mocha test framework

        npm install --global mocha

Follow instructions at https://www.googlesource.com/new-password to authenticate
to Git-on-Borg.

## Project setup

Do once to clone and set up project:

1.  Clone repo. A new folder will be created.

        git clone git clone https://earthengine.googlesource.com/users/gmiceli/ee-lct
        cd ee-lct

1.  Download deps to `./node_modules`:

        npm install

Save the private key JSON file associated with yout EE service account
(TODO(gino-m): Instructions in `test/.private-key.json`.

## Dev workflow

### Testing

*   Download algorithms from server for local testing

        npm run update-algorithms

*   Run unit tests

        npm run test:unit

*   Run integration tests

        npm run test:int

*   Run all tests

        npm run test

*   Check unit test coverage

        npm run coverage

*   See coverage report in browser

        npm run open-coverage

### Submitting changes

Commit and push to Git-on-Borg:

> Note: You'll need to pull any changes from remote before pushing new ones.

      git commit -m '<Commit message>'
      git pull
      git push

Most modern text editors can do this for you.
