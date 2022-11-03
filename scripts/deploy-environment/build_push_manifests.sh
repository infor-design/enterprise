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
  SERVICE_NAME

if [ -z $IMAGE_VERSION ]
then
    IMAGE_VERSION=$(node -p "require('./package.json').version")
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

rm -rf $WORKDIR/$SERVICE_NAME 2>/dev/null
mkdir -p $WORKDIR/$SERVICE_NAME && cp -R $WORKDIR/manifests/* $WORKDIR/$SERVICE_NAME/
sed -i -e "s/%SERVICE_NAME%/$SERVICE_NAME/g" $WORKDIR/$SERVICE_NAME/ingress.yaml
sed -i -e "s/%SERVICE_NAME%/$SERVICE_NAME/g" $WORKDIR/$SERVICE_NAME/service.yaml
sed -i -e "s/%SERVICE_NAME%/$SERVICE_NAME/g" $WORKDIR/$SERVICE_NAME/deployment.yaml
sed -i -e "s/%IMAGE_VERSION%/$IMAGE_VERSION/g" $WORKDIR/$SERVICE_NAME/deployment.yaml
python3.10 $WORKDIR/scripts/annotations.py -p $WORKDIR/$SERVICE_NAME/deployment.yaml

mkdir -p $WORKDIR/apps/enterprise/enterprise-$SERVICE_NAME/
mv -f $WORKDIR/$SERVICE_NAME/* $WORKDIR/apps/enterprise/enterprise-$SERVICE_NAME/

cd $WORKDIR/apps/
CHANGES=$(git status --porcelain)

if [[ -z $CHANGES ]]; then
    echo "there are no changes"
else
    git add *
    git commit -am "$CHANGES"
    git push origin main
fi
