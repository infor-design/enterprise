#!/bin/bash
set -e

source ./utils.sh
trap exit_trap EXIT

export NODE_OPTIONS=--max_old_space_size=4096

REPOROOT=/root/enterprise

function main() {
  check_required_vars GITHUB_ACCESS_TOKEN BUILD_FROM SITE APP_REPO
  clean_clone_repo $GITHUB_ACCESS_TOKEN $APP_REPO $BUILD_FROM $REPOROOT
  npm install
  node ./scripts/deploy-documentation.js --site $SITE
}

main "$@"
