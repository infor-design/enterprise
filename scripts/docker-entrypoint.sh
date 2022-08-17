#!/bin/bash

set -e

cd /controls && npm install && npm run build && node server
