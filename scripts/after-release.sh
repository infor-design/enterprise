#!/bin/bash

# ./scripts/after-release.sh latest 4.32.0
# ./scripts/after-release.sh beta 4.33.0-beta.0

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
    aws s3 cp dist s3://infor-devops-core-soho-us-east-1/sohoxi/$RELEASE_VERSION --recursive --profile sohoxi --acl public-read
fi
