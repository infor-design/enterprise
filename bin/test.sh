#!/bin/bash
# Run SoHo Xi testing suite.
# Starts Selenium, The Intern, and cleans up afterward.

echo 'Starting SoHo Xi Test Suite...'

killServers ()
{
  PS_RESULT=`ps -eo pid,args | grep -server.jar | grep -v grep | cut -c1-6`
  SERVER_PID=`ps -eo pid,args | grep selenium-server | grep -v grep | cut -c1-6`

  if [[ $JAR_PID ]]; then
    echo 'Selenium JAR process found.  Stopping JAR...'
    kill -9 $JAR_PID
  fi

  if [[ $SERVER_PID ]]; then
    echo 'selenium-standalone server process found.  Stopping selenium-server...'
    kill -9 $SERVER_PID
  fi
}

# don't run multiple selenium JARs & standalone instances
killServers

# start selenium
./node_modules/.bin/selenium-standalone start &
sleep 3s

# run intern, wait til it finishes
# config=test2/intern.local.functional
./node_modules/.bin/intern-runner config=test2/intern.local.functional &&

# kill the servers when we're done
killServers

echo 'SoHo Xi Test Suite has been shutdown.'

exit $?
