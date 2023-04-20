#!/bin/bash
set -e

source ./utils.sh
trap exit_trap EXIT

WORKDIR="/usr/src"
REPOROOT=$WORKDIR/apps

check_required_vars GITHUB_ACCESS_TOKEN MANIFESTS_REPO SERVICE_NAME
clean_clone_repo $GITHUB_ACCESS_TOKEN $MANIFESTS_REPO "main" $REPOROOT

cd $REPOROOT

if [ -z $IMAGE_VERSION ]
then
    IMAGE_VERSION=$(node -p "require('$REPOROOT/package.json').version")
fi

rm -rf $WORKDIR/$SERVICE_NAME 2>/dev/null
mkdir -p $WORKDIR/$SERVICE_NAME && cp -R $WORKDIR/manifests/* $WORKDIR/$SERVICE_NAME/
sed -i -e "s/%SERVICE_NAME%/$SERVICE_NAME/g" $WORKDIR/$SERVICE_NAME/ingress.yaml
sed -i -e "s/%SERVICE_NAME%/$SERVICE_NAME/g" $WORKDIR/$SERVICE_NAME/service.yaml
sed -i -e "s/%SERVICE_NAME%/$SERVICE_NAME/g" $WORKDIR/$SERVICE_NAME/deployment.yaml
sed -i -e "s/%IMAGE_VERSION%/$IMAGE_VERSION/g" $WORKDIR/$SERVICE_NAME/deployment.yaml
python3.10 $WORKDIR/scripts/annotations.py -p $WORKDIR/$SERVICE_NAME/deployment.yaml

mkdir -p $REPOROOT/enterprise/enterprise-$SERVICE_NAME/
mv -f $WORKDIR/$SERVICE_NAME/* $REPOROOT/enterprise/enterprise-$SERVICE_NAME/

CHANGES=$(git status --porcelain)

if [[ -z $CHANGES ]]; then
    echo "there are no changes"
else
    git add *
    git commit -am "$CHANGES"
    git push origin main
fi
