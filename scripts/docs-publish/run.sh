#!/bin/bash

export TERM=xterm
export NODE_OPTIONS=--max_old_space_size=4096

_GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN:-}
_BRANCH=${BRANCH:-}

_NPM_TOKEN=${NPM_TOKEN:-}
_NPM_COMMAND=${NPM_COMMAND:-}
_RELEASEIT_FLAGS=${RELEASEIT_FLAGS:-}

rm -fr /root/enterprise/*
git clone https://$_GITHUB_ACCESS_TOKEN@github.com/infor-design/enterprise.git /root/enterprise
cd /root/enterprise
git remote set-url origin git@github.com:infor-design/enterprise.git

git checkout $_BRANCH && git pull --tags

npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm install
npm run build

if [[ -n "$_RELEASEIT_FLAGS" ]];
then
  release-it $_RELEASEIT_FLAGS --config .release-it.json --ci
else
  npmcmd=($_NPM_COMMAND)
  "${npmcmd[@]}"
fi
