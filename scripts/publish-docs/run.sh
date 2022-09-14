#!/bin/bash

set -e

export TERM=xterm
export NODE_OPTIONS=--max_old_space_size=4096

_GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN:-}
_SITE=${SITE:-}
_BRANCH=${BRANCH:-}

rm -rf /root/enterprise/{..?*,.[!.]*,*} 2>/dev/null

git clone https://$_GITHUB_ACCESS_TOKEN@github.com/infor-design/enterprise.git /root/enterprise
cd /root/enterprise
git remote set-url origin https://${_GITHUB_ACCESS_TOKEN}@github.com/infor-design/enterprise.git

git checkout $_BRANCH
npm install
node ./scripts/deploy-documentation.js --site $_SITE
