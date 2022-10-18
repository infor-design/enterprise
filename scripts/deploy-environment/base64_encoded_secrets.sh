#!/bin/bash

while read -r line; do declare -x "$line"; done < <(egrep -v "(^#|^\s|^$)" .env)

echo "IMAGE_LIBRARY_USER ${IMAGE_LIBRARY_USER}"
echo -n ${IMAGE_LIBRARY_USER} | base64
echo ""

echo "IMAGE_LIBRARY_PASS ${IMAGE_LIBRARY_PASS}"
echo -n ${IMAGE_LIBRARY_PASS} | base64
echo ""
