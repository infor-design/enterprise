#!/bin/bash

# ./scripts/after-release.sh latest 4.12.1
# ./scripts/after-release.sh beta 4.13.0-beta.0

RELEASE_TAG=$1
RELEASE_VERSION=$2

echo "Queuing builds using jenkins-deploy.sh"
echo ""

# Add version build to queue
./scripts/jenkins-deploy.sh -b $RELEASE_VERSION -q

if [[ "$RELEASE_TAG" == "latest" ]]; then
    # Also add latest build to queue
    ./scripts/jenkins-deploy.sh -b $RELEASE_VERSION -l -q

    echo "Publishing and Deploying $RELEASE_VERSION documentation"
    echo ""
    node ./scripts/deploy-documentation.js --site prod

    echo "Publishing $RELEASE_VERSION files to AWS CDN"
    echo ""
    AWS_PROFILE=sohoxi directory-to-s3 -d dist infor-devops-core-soho-us-east-1/sohoxi/$RELEASE_VERSION
fi
