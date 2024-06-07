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
  NPM_TOKEN \
  BRANCH \
  REPO_OWNER_NAME \
  DRY_RUN

npm set "//registry.npmjs.org/:_authToken=${NPM_TOKEN}"

_ROOT_DIR=/root/enterprise

rm -rf $_ROOT_DIR/{..?*,.[!.]*,*} 2>/dev/null

git clone $REPO_OWNER_NAME $_ROOT_DIR
cd $_ROOT_DIR

git fetch --all
git checkout $BRANCH > /dev/null

if [ $? = 1 ] ; then
    echo "Git checkout failed. Please make sure the branch you are checking out exists."
    exit 1
fi

npm install
npm run build

if [ -z $VERSION ]
then
    VERSION=$(node -p "require('./package.json').version")
fi

git tag "${VERSION}"

if [ "$DRY_RUN" = "true" ]
then
    echo "Skipping git push and npm publish in dry run mode."
    npm publish --access public --dry-run
    exit 0
fi

git push origin "${VERSION}"
npm publish --access public
