#!/bin/bash

# install again for all packages to be available
npm install

# Use package.json for everything

PKG_NAME=$(node -p "require('./package.json').name")
PKG_VERSION=$(node -p "require('./package.json').version")
DATE=$(date +%Y%m%d)
PKG_NIGHTLY=$PKG_VERSION.$DATE
PKG_URL=https://registry.npmjs.org/$PKG_NAME/$PKG_NIGHTLY

if [[ -z $NPM_AUTH_TOKEN ]]; then echo "NPM_AUTH_TOKEN must be defined in Travis"; exit 1; fi

if [ "$TRAVIS" ]; then
    HTTP_RESP=`curl -s -o /dev/null -w "%{http_code}" $PKG_URL`
    echo "$PKG_URL ($HTTP_RESP)"

    if [ "$HTTP_RESP" == 200 ]; then
        echo "$PKG_URL@$PKG_NIGHTLY is already published"
        exit 1
    elif [ "$HTTP_RESP" == 404 ]; then
        echo "Publishing $PKG_NAME@$PKG_NIGHTLY ..."

        npm config set '//registry.npmjs.org/:_authToken' $NPM_AUTH_TOKEN
        npm config set loglevel warn
        npm version $PKG_NIGHTLY
        npm publish --tag dev

        if [ $? -gt 0 ]; then
            echo "npm publish exited with code $?"
            exit 1
        else
            echo "Successfully published $PKG_NAME@$PKG_NIGHTLY"
        fi
    else
        echo "Unexpected registry status code: $s"
        exit 1
    fi
else
    echo "Must be run from Travis CI"
    exit 1
fi
