#!/bin/bash

export TERM=xterm
export NODE_OPTIONS=--max_old_space_size=4096

_GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN:-}
_NPM_TOKEN=${NPM_TOKEN:-}

_BRANCH=${BRANCH:-}
_NPM_COMMAND=${NPM_COMMAND:-}
_NPM_LATEST=${NPM_LATEST:-}
_RELEASEIT_FLAGS=${RELEASEIT_FLAGS:-}
_RELEASE_INCREMENT=${RELEASE_INCREMENT:-}

rm -rf /root/enterprise/{..?*,.[!.]*,*} 2>/dev/null
git clone https://$_GITHUB_ACCESS_TOKEN@github.com/infor-design/enterprise.git /root/enterprise
cd /root/enterprise
git remote set-url origin https://${_GITHUB_ACCESS_TOKEN}@github.com/infor-design/enterprise.git

git checkout $_BRANCH

npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm install
npm run build

if [ -n "$_RELEASEIT_FLAGS" ];
then
  release-it $_RELEASEIT_FLAGS --config .release-it.json --ci -- $_RELEASE_INCREMENT
else
  npmcmd=($_NPM_COMMAND)
  "${npmcmd[@]}"
fi

if [[ "$_RELEASEIT_FLAGS" != *"--dry-run"* ]];
then
  if [ -n "$_NPM_LATEST" ];
  then
    npm dist-tags add ids-enterprise@$_NPM_LATEST latest
  fi
fi
