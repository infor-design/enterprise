#!/bin/bash
# Run SoHo Xi testing suite on the build server.
# First, runs the Intern unit tests.
# Then, starts Selenium, The Intern, and cleans up afterward.
#
# NOTE:  This script has a hard dependency on X Virtual Frame Buffer, needed to headlessly run Firefox/Chrome/etc
# http://elementalselenium.com/tips/38-headless

echo "Starting SoHo Xi Test Suite..."

killServers ()
{
  SOHO_PID=`ps -eo pid,args | grep "node server" | grep -v grep | cut -c1-6`
  JAR_PID=`ps -eo pid,args | grep -server.jar | grep -v grep | cut -c1-6`
  SERVER_PID=`ps -eo pid,args | grep selenium-server | grep -v grep | cut -c1-6`

  if [[ $SOHO_PID ]]; then
    echo 'SoHo Xi Dev Server process found.  Stopping Dev Server...'
    kill -INT $SOHO_PID
  fi

  if [[ $JAR_PID ]]; then
    echo 'Selenium JAR process found.  Stopping JAR...'
    kill -9 $JAR_PID
  fi

  if [[ $SERVER_PID ]]; then
    echo '"selenium-standalone" server process found.  Stopping "selenium-standalone"...'
    kill -9 $SERVER_PID
  fi
}

# don't run multiple selenium JARs & standalone instances
killServers

# start SoHo Xi Dev Server
# set this up as file descriptor #3
exec 3< <(node server)

while read line; do
   case "$line" in
    *"Soho server is running"*)
      FOUNDSOHO=true
      break
      ;;
   *)
      ;;
   esac
done <&3

if [[ $FOUNDSOHO != true ]]; then
  echo "Could not find or start a SoHo Xi Dev Server... exiting..."
  exit 1
fi

# run Intern once using the "client", to run Unit tests only
./node_modules/.bin/intern-client config=test2/intern.local.unit

# start selenium
# set this up as file descriptor #6
exec 6< <(./node_modules/.bin/selenium-standalone start)

while read line; do
   case "$line" in
    *"Selenium started"*)
      FOUNDSELENIUM=true
      break
      ;;
   *)
      ;;
   esac
done <&6

if [[ $FOUNDSELENIUM != true ]]; then
  echo 'Could not find or start a selenium server... exiting...'
  exit 1
fi

# run Xvfb as file descriptor 7 and export the variable
echo "Starting X Virtual Frame Buffer..."
exec 7< <(Xvfb :99 -ac -screen 0 1280x1024x24)
export DISPLAY=:99

echo "Starting Intern Test Suite with arguments ${INTERN_ARGS}..."

# run intern, wait til it finishes.
# config=test2/intern.local.functional
# kill the servers when we're done.
./node_modules/.bin/intern-runner config=test2/intern.local.functional && killServers

# kill file descriptors #3 and #7
exec 3<&-
exec 6<&-
unset DISPLAY

echo 'SoHo Xi Test Suite has been shutdown.'

exit $?
