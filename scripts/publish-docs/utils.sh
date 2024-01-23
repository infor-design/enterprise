#!/bin/bash

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
}
