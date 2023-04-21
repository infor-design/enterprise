#!/bin/bash

function cleanup() {
  exit_code=$?

  if [[ ${exit_code} -eq 0 ]]; then
    pkill dockerd
    exit $exit_code
  elif [[ ${exit_code} -eq 1 ]]; then
    pkill dockerd
    exit $exit_code
  fi
}

function exit_trap () {
  local lc="$BASH_COMMAND" rc=$?
  echo "Command [$lc] exited with code [$rc]"
}

function check_required_vars() {
  var_names=("$@")
  for var_name in "${var_names[@]}"; do
    [ -z "${!var_name}" ] && echo "$var_name is unset." && var_unset=true
  done
  [ -n "$var_unset" ] && exit 1
  return 0
}

function clean_clone_repo() {
  rm -rf $4/{..?*,.[!.]*,*} 2>/dev/null
  git clone https://$1@github.com/$2.git $4

  cd $4

  git remote set-url origin https://$1@github.com/$2.git
  git fetch --all
  git checkout $3 > /dev/null
}

function install_packages() {
  DEMO_PACKAGE_JSON_FILE=./app/package.json

  if test -f "$DEMO_PACKAGE_JSON_FILE"; then
      cp -fr $DEMO_PACKAGE_JSON_FILE ./package.json && rm -fr ./package-lock.json
      npm install
      git checkout package.json package-lock.json
  else
    npm install
  fi

  npm run build
  npm run build:demoapp
}

function make_dockerfile() {
  cat >Dockerfile <<EOL
FROM hookandloop/sohoxi-demo:1.0.1

ADD ./ /controls
ADD ./dist /www/data/artifacts
ADD ./docs /www/data/docs

RUN chown -R www-data.www-data /www/data
EOL
}

function build_and_push() {
  docker login -u "$1" -p "$2"
  docker build -f ./Dockerfile -t $3/$4:$5 .
  docker history --human --format "{{.CreatedBy}}: {{.Size}}" $3/$4:$5
  docker push $3/$4:$5
}