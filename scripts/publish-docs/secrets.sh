#!/bin/bash

while read -r line; do declare -x "$line"; done < <(egrep -v "(^#|^\s|^$)" .env)

echo "GITHUB_ACCESS_TOKEN ${GITHUB_ACCESS_TOKEN}"
echo -n ${GITHUB_ACCESS_TOKEN} | base64
echo ""

echo "DOCS_API_KEY ${DOCS_API_KEY}"
echo -n ${DOCS_API_KEY} | base64
echo ""
