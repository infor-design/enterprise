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
  NPM_TOKEN \
  BRANCH \
  REPO_OWNER_NAME

rm -rf /root/enterprise/{..?*,.[!.]*,*} 2>/dev/null

#echo "[url \"git@github.com:\"]\n\tinsteadOf = https://github.com/" >> /root/.gitconfig
#git config --global url."https://${GITHUB_ACCESS_TOKEN}:@github.com/".insteadOf "https://github.com/"

git clone https://$GITHUB_ACCESS_TOKEN@github.com/$REPO_OWNER_NAME.git /root/enterprise
cd /root/enterprise
git remote set-url origin https://${GITHUB_ACCESS_TOKEN}@github.com/$REPO_OWNER_NAME.git

git checkout $BRANCH

npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm install
npm run build

if [ -n "$RELEASEIT_FLAGS" ];
then
  release-it $RELEASEIT_FLAGS --config .release-it.json --ci -- $RELEASE_INCREMENT
else
  if [ -n "$NPM_COMMAND" ];
  then
    npmcmd=($NPM_COMMAND)
    "${npmcmd[@]}"
  else
    echo "warning: NPM_COMMAND not set"
  fi
fi

if [[ "$RELEASEIT_FLAGS" == *"--dry-run=false"* ]];
then
  if [ -n "$NPM_LATEST" ];
  then
    npm dist-tags add ids-enterprise@$NPM_LATEST latest
  else
    echo "warning: NPM_LATEST not set"
  fi
fi
