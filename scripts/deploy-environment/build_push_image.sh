#!/bin/bash

BUILD_NAME=""

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
  IMAGE_LIBRARY_USER \
  IMAGE_LIBRARY_PASS \
  APP_REPO \
  ORG_NAME \
  BASE_CONTAINER_NAME \
  BUILD_FROM

rm -rf /usr/src/enterprise/{..?*,.[!.]*,*} 2>/dev/null

git clone https://$GITHUB_ACCESS_TOKEN@github.com/$APP_REPO.git /usr/src/enterprise
cd /usr/src/enterprise
git remote set-url origin https://$GITHUB_ACCESS_TOKEN@github.com/$APP_REPO.git
git fetch --all
git checkout $BUILD_FROM > /dev/null

if [ $? = 1 ] ; then
    echo "Git checkout failed. Please make sure the branch you are checking out exists."
    pkill dockerd
    exit 1
fi

BRANCHES=$(git branch -a | sort -V)
BRANCHES_LIST=($BRANCHES)

VERSION=$(node -p "require('./package.json').version")
VERSION_STRING=$(echo "${VERSION//./}")
COMMIT=$(git rev-parse --short HEAD)

if [ -z $SUBDOMAIN_NAME ]
then
  BUILD_NAME=$VERSION_STRING-$BASE_CONTAINER_NAME
else
  BUILD_NAME=$SUBDOMAIN_NAME-$BASE_CONTAINER_NAME
fi

if [ "$BUILD_AS_LATEST" = true ]
then
	BUILD_NAME=latest-$BASE_CONTAINER_NAME
fi

npm install
npm run build
npx grunt demo

cat >Dockerfile <<EOL
FROM hookandloop/sohoxi-demo:1.0.1

ADD ./ /controls
ADD ./dist /www/data/artifacts
ADD ./docs /www/data/docs

RUN chown -R www-data.www-data /www/data
EOL

docker build -f ./Dockerfile -t $ORG_NAME/$BASE_CONTAINER_NAME:$VERSION .
docker history --human --format "{{.CreatedBy}}: {{.Size}}" $ORG_NAME/$BASE_CONTAINER_NAME:$VERSION
docker login -u "$IMAGE_LIBRARY_USER" -p "$IMAGE_LIBRARY_PASS"
docker push $ORG_NAME/$BASE_CONTAINER_NAME:$VERSION

# We have to kill dockerd process in the sidecar container
# for the entire job to exit with exit code 0.
#
# dockerd process must exist, so we don't need to ignore
# exit code 1 (pkill dockerd || true) if the process does not exist
pkill dockerd
exit 0
