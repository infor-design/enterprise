#!/bin/bash

_IMAGE_LIBRARY_USER=${IMAGE_LIBRARY_USER:-}
_IMAGE_LIBRARY_PASS=${IMAGE_LIBRARY_PASS:-}
_GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN:-}
_HANDLER_API_KEY=${HANDLER_API_KEY:-}
_REPO_OWNER_NAME=${REPO_OWNER_NAME:-}

_HANDLER_API_URL=${HANDLER_API_URL:-}
_TLS_SECRET=${TLS_SECRET:-}

_ORG_NAME=${ORG_NAME:-}
_BASE_CONTAINER_NAME=${BASE_CONTAINER_NAME:-}
_BUILD_FROM=${BUILD_FROM:-}

BRANCH_REGEX="(remotes\/origin\/[0-9.@]+[0-9.@]+x)"
BRANCH_PREFIX="remotes/origin/"
LATEST=""

deploy(){
  BUILD_NAME=$1
  VERSION=$2
  deployment_resp=$(curl --location --request POST "$_HANDLER_API_URL/action/up/$_HANDLER_API_KEY" \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "project_name": "'"soho-demo-$BUILD_NAME"'", 
      "service": {
        "'"$BUILD_NAME"'": {
          "image": "'"$_ORG_NAME/$_BASE_CONTAINER_NAME:$VERSION"'",
          "sets": [{"ingress.tls[0].secretName": "'"$_TLS_SECRET"'"}]
        }
      }
    }')
}

reload(){
  BUILD_NAME=$1
  reload_resp=$(curl --location --request POST "$_HANDLER_API_URL/reload/$_HANDLER_API_KEY" \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "project_name": "'"soho-demo-$BUILD_NAME"'"
  }')

  echo $reload_resp | jq .
}

git clone https://$_GITHUB_ACCESS_TOKEN@github.com/$_REPO_OWNER_NAME.git /root/enterprise
cd /root/enterprise
git remote set-url origin https://$_GITHUB_ACCESS_TOKEN@github.com/$_REPO_OWNER_NAME.git
git fetch --all
git checkout $_BUILD_FROM > /dev/null

if [ $? = 1 ] ; then
    echo "Git checkout failed. Please make sure the branch your are checking out exists."
    pkill dockerd
    exit 1
fi

BRANCHES=$(git branch -a | sort -V)
BRANCHES_LIST=($BRANCHES)

VERSION_STRING=$(echo "${_BUILD_FROM//./}") # Removes . to not break subdomain
BUILD_NAME=$VERSION_STRING-$_BASE_CONTAINER_NAME
VERSION=$(node -p "require('./package.json').version")
COMMIT=$(git rev-parse --short HEAD)

for BRANCH in "${BRANCHES_LIST[@]}" ; do
  if [[ $BRANCH =~ $BRANCH_REGEX ]];
  then
      clean=${BRANCH#"$BRANCH_PREFIX"}
      LATEST=$(echo "$clean" | xargs)
  fi
done

if [ "$_BUILD_FROM" = "$LATEST" ]
then
	BUILD_NAME=latest-$_BASE_CONTAINER_NAME
fi

npm install && npm run build && npx grunt demo

cat >Dockerfile <<EOL
FROM hookandloop/sohoxi-demo:1.0.1

ADD ./ /controls
ADD ./dist /www/data/artifacts
ADD ./docs /www/data/docs

RUN chown -R www-data.www-data /www/data
EOL

docker build -f ./Dockerfile -t $_ORG_NAME/$_BASE_CONTAINER_NAME:$VERSION .
docker history --human --format "{{.CreatedBy}}: {{.Size}}" $_ORG_NAME/$_BASE_CONTAINER_NAME:$VERSION
docker login -u "$_IMAGE_LIBRARY_USER" -p "$_IMAGE_LIBRARY_PASS"
docker push $_ORG_NAME/$_BASE_CONTAINER_NAME:$VERSION

check_deployment_resp=$(curl --location --request POST "$_HANDLER_API_URL/status/$_HANDLER_API_KEY" \
--header 'Content-Type: application/json' \
--data-raw '{
	"project_name": "'"soho-demo-$BUILD_NAME"'",
	"service_name": "'"$BUILD_NAME"'"
}')

deployment_response_reason=$(jq .resp.response.reason <<< ${check_deployment_resp})
ready_replicas=$(jq .resp.command_response.readyReplicas <<< ${check_deployment_resp})

if [ "$deployment_response_reason" = "null" ]
then
  echo "Deployment does not exist, deploying..."
  deploy $BUILD_NAME $VERSION
elif [ "$deployment_response_reason" = "\"not deployed"\" ]
then
  echo "Deployment not deployed, deploying..."
  deploy $BUILD_NAME $VERSION
else
  if [ "$ready_replicas" = "0" ]
  then
    echo "Deployment replica count is 0, trying deployment..."
    deploy $BUILD_NAME $VERSION
  else
    echo "Deployment exists, reloading..."
    deploy $BUILD_NAME $VERSION
    reload $BUILD_NAME
  fi
fi

echo "Deployed $VERSION at $COMMIT https://$BUILD_NAME.demo.design.infor.com"

# We have to kill dockerd process in the sidecar container
# for the entire job to exit with exit code 0.
#
# dockerd process must exist, so we don't need to ignore
# exit code 1 (pkill dockerd || true) if the process does not exist
pkill dockerd
exit 0
