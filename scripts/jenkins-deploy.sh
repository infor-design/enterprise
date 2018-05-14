#!/bin/bash

JENKINS_USER="jeeves"
JENKINS_DOMAIN="hl-jenkins-dev.us-east-1.elasticbeanstalk.com"
JENKINS_JOB="soho4-swarm-deploy"
JENKINS_URL="http://$JENKINS_USER:$JENKINS_SECRET@$JENKINS_DOMAIN"

if [ -z "$1" ]; then
    BRANCH="master"
else
    BRANCH=$1
fi

if [[ -z $JENKINS_SECRET ]]; then echo "JENKINS_SECRET must be defined"; exit 1; fi
if [[ -z $JENKINS_JOB_TOKEN ]]; then echo "JENKINS_JOB_TOKEN must be defined"; exit 1; fi
if [[ -z $JENKINS_CRUMB_TOKEN ]]; then echo "JENKINS_CRUMB_TOKEN must be defined"; exit 1; fi

check_status () {
    job_status=$(curl -s $JENKINS_URL/job/$JENKINS_JOB/lastBuild/api/json | \
        python -c "import sys, json; print json.load(sys.stdin)['result']")
    echo $job_status
}

get_build_number () {
    build_number=$(curl -s $JENKINS_URL/job/$JENKINS_JOB/lastBuild/api/json | \
        python -c "import sys, json; print json.load(sys.stdin)['number']")
    echo $build_number
}

CURRENT_JOB_STATUS=`check_status`

if [[ "$CURRENT_JOB_STATUS" == "None" ]]; then
    CURRENT_BUILD_NUMBER=`get_build_number`
    echo "Job #$CURRENT_BUILD_NUMBER is already running. Aborting that job now..."
    RESP=$(curl --write-out "%{http_code}\n" --silent --output /dev/null -X POST "$JENKINS_URL/job/$JENKINS_JOB/$CURRENT_BUILD_NUMBER/stop")
    if [[ "$RESP" == "302" ]]; then
        echo "Successfully aborted job #$CURRENT_BUILD_NUMBER"
    else
        exit 1
        echo "ERROR: Request to Jenkins returned $RESP"
    fi
else
    echo "Adding Jenkins build of $BRANCH branch to queue..."
fi

CRUMB=$(curl -s -X GET "$JENKINS_URL/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,%22:%22,//crumb)")
RESP=$(curl --write-out "%{http_code}\n" --silent --output /dev/null -X POST -H "Jenkins-Crumb:$JENKINS_CRUMB_TOKEN" "$JENKINS_URL/job/$JENKINS_JOB/buildWithParameters?CONTAINER=enterprise&GIT_BRANCH=$BRANCH&GIT_TAG=4.6.0&GIT_TAG_OR_BRANCH=branch&token=$JENKINS_JOB_TOKEN")

if [[ "$RESP" == "201" ]]; then
    echo "SUCCESS: Jenkins sucessfully queued job"
else
    exit 1
    echo "ERROR: Request to Jenkins returned $RESP"
fi

INITIAL_STATUS=`check_status`
if [ -n "initial_status" ]
then
    BUILD_STATUS=`check_status`
    CURRENT_BUILD_NUMBER=`get_build_number`
    echo -n "Watching build #$CURRENT_BUILD_NUMBER to report on status..."
    while [[ "$BUILD_STATUS" == "None" ]]; do
        sleep 10
        echo -n "."
        BUILD_STATUS=`check_status`
    done
    if [[ "$BUILD_STATUS" == "SUCCESS" ]]; then
        echo "" # new line
        echo "DEPLOY to http://$BRANCH-enterprise.demo.design.infor.com SUCCESSFUL."
        exit
    elif [[ "$BUILD_STATUS" == "ABORTED" ]]; then
        echo "" # new line
        echo "Build was $BUILD_STATUS. Exiting with 0 since this was likely intentional."
        exit 0
    else
        echo "Build was ended with status: $BUILD_STATUS!"
        exit 1
    fi
else
  echo "BUILD FAILURE: Other build is unsuccessful or status could not be obtained."
  exit 1
fi
