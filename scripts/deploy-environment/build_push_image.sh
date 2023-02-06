#!/bin/bash

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
  BUILD_FROM \
  IMAGE_VERSION

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

COMMIT=$(git rev-parse --short HEAD)
DEMO_PACKAGE_JSON_FILE=/app/package.json

if test -f "$DEMO_PACKAGE_JSON_FILE"; then
    cp -fr $DEMO_PACKAGE_JSON_FILE ./package.json && rm package-lock.json
    npm install
    git checkout package.json package-lock.json
else
  npm install
fi

npm run build
npm run build:demoapp

cat >Dockerfile <<EOL
FROM hookandloop/sohoxi-demo:1.0.1

ADD ./ /controls
ADD ./dist /www/data/artifacts
ADD ./docs /www/data/docs

RUN chown -R www-data.www-data /www/data
EOL

docker login -u "$IMAGE_LIBRARY_USER" -p "$IMAGE_LIBRARY_PASS"

docker build -f ./Dockerfile -t $ORG_NAME/$BASE_CONTAINER_NAME:$IMAGE_VERSION .
docker history --human --format "{{.CreatedBy}}: {{.Size}}" $ORG_NAME/$BASE_CONTAINER_NAME:$IMAGE_VERSION
docker push $ORG_NAME/$BASE_CONTAINER_NAME:$IMAGE_VERSION

if [ "$BUILD_AS_LATEST" = true ]
then
  docker build -f ./Dockerfile -t $ORG_NAME/$BASE_CONTAINER_NAME:latest .
  docker history --human --format "{{.CreatedBy}}: {{.Size}}" $ORG_NAME/$BASE_CONTAINER_NAME:latest
  docker push $ORG_NAME/$BASE_CONTAINER_NAME:latest
fi

# We have to kill dockerd process in the sidecar container
# for the entire job to exit with exit code 0.
#
# dockerd process must exist, so we don't need to ignore
# exit code 1 (pkill dockerd || true) if the process does not exist
pkill dockerd
exit 0
