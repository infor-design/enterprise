#!/bin/bash

WORKDIR="/usr/src"

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
  MANIFESTS_REPO \
  VERSION \
  IMAGE_VERSION

if [ ! -z $SUBDOMAIN_NAME ]
then
  VERSION=$SUBDOMAIN_NAME
fi

if [ "$BUILD_AS_LATEST" = true ]
then
	VERSION=latest
fi

rm -rf $WORKDIR/apps/{..?*,.[!.]*,*} 2>/dev/null

git clone https://$GITHUB_ACCESS_TOKEN@github.com/$MANIFESTS_REPO.git $WORKDIR/apps
cd $WORKDIR/apps
git remote set-url origin https://$GITHUB_ACCESS_TOKEN@github.com/$MANIFESTS_REPO.git
git pull --rebase

if [ $? = 1 ] ; then
    echo "Git checkout failed..."
    exit 1
fi

rm -rf $WORKDIR/$VERSION 2>/dev/null
mkdir -p $WORKDIR/$VERSION && cp -R $WORKDIR/manifests/* $WORKDIR/$VERSION/
sed -i -e "s/%VERSION%/$VERSION/g" $WORKDIR/$VERSION/ingress.yaml
sed -i -e "s/%VERSION%/$VERSION/g" $WORKDIR/$VERSION/service.yaml
sed -i -e "s/%VERSION%/$VERSION/g" $WORKDIR/$VERSION/deployment.yaml
sed -i -e "s/%IMAGE_VERSION%/$IMAGE_VERSION/g" $WORKDIR/$VERSION/deployment.yaml

mkdir -p $WORKDIR/apps/enterprise/enterprise-$VERSION/
mv -f $WORKDIR/$VERSION/* $WORKDIR/apps/enterprise/enterprise-$VERSION/

cd $WORKDIR/apps/
CHANGES=$(git status --porcelain)

if [[ -z $CHANGES ]]; then
    echo "there are no changes"
else
    git add *
    git commit -am "$CHANGES"
    git push origin main
fi
