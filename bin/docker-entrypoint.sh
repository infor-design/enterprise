#!/bin/bash

set -e

cd /controls && npm install && grunt && node server
