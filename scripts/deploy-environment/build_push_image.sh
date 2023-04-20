#!/bin/bash
set -e

source ./utils.sh
trap exit_trap EXIT
trap "cleanup" EXIT

REPOROOT=/usr/src/enterprise

function main() {
  check_required_vars \
    GITHUB_ACCESS_TOKEN IMAGE_LIBRARY_USER IMAGE_LIBRARY_PASS APP_REPO \
    ORG_NAME BASE_CONTAINER_NAME BUILD_FROM IMAGE_VERSION

  clean_clone_repo $GITHUB_ACCESS_TOKEN $APP_REPO $BUILD_FROM $REPOROOT
  cd $REPOROOT && install_packages
  cd $REPOROOT && make_dockerfile
  cd $REPOROOT && build_and_push $IMAGE_LIBRARY_USER $IMAGE_LIBRARY_PASS $ORG_NAME \
    $BASE_CONTAINER_NAME $IMAGE_VERSION
}

main "$@"
