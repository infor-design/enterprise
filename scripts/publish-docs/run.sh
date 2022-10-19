#!/bin/bash

set -e

export TERM=xterm
export NODE_OPTIONS=--max_old_space_size=4096

check_required_vars()
{
    var_names=("$@")
    for var_name in "${var_names[@]}"; do
        [ -z "${!var_name}" ] && echo "$var_name is unset." && var_unset=true
    done
    [ -n "$var_unset" ] && exit 1
    return 0
}

check_required_vars \
  GITHUB_ACCESS_TOKEN \
  BUILD_FROM \
  SITE \
  APP_REPO

rm -rf /root/enterprise/{..?*,.[!.]*,*} 2>/dev/null

git clone https://$GITHUB_ACCESS_TOKEN@github.com/$APP_REPO.git /root/enterprise
cd /root/enterprise
git remote set-url origin https://${GITHUB_ACCESS_TOKEN}@github.com/$APP_REPO.git

git fetch --all
git checkout $BUILD_FROM

npm install
node ./scripts/deploy-documentation.js --site $SITE
