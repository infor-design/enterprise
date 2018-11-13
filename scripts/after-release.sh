#!/bin/bash

# ./scripts/after-release.sh latest 4.12.1
# ./scripts/after-release.sh beta 4.13.0-beta.0

RELEASE_TAG=$1
RELEASE_VERSION=$2

echo "Queuing builds using jenkins-deploy.sh"
echo ""

# Add version build to queue
./scripts/jenkins-deploy.sh -b $RELEASE_VERSION -q

# Also add latest build to queue
if [[ "$RELEASE_TAG" == "latest" ]]; then
    ./scripts/jenkins-deploy.sh -b $RELEASE_VERSION -l -q
fi
