#!/bin/bash

PKG_VERSION=$(node -p "require('./publish/package.json').version")
DATE=$(date +%Y%m%d)

cd publish
npm version $PKG_VERSION.$DATE
