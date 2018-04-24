#!/bin/bash
# Stops the development server.

PROCESS_ID=`ps -eo pid,args | grep "node app/server.js" | grep -v grep | cut -c1-6`
kill -INT $PROCESS_ID
