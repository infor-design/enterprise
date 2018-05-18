#!/bin/bash

JENKINS_USER="jeeves"
JENKINS_DOMAIN="hl-jenkins-dev.us-east-1.elasticbeanstalk.com"
JENKINS_JOB="soho4-swarm-deploy"
JENKINS_URL="http://$JENKINS_USER:$JENKINS_SECRET@$JENKINS_DOMAIN"

BUILD_FROM="master"
GIT_TAG_OR_BRANCH="branch"
BUILD_AS_LATEST=false
WATCH_FOR_BUILD_STATUS=false

while getopts "b:t:lw" opt; do
    case $opt in
        b)
            # the branch or tag name to build from
            BUILD_FROM="${OPTARG}"
            ;;
        t)
            # type - either `branch` or `tag`
            # defaults to branch
            GIT_TAG_OR_BRANCH="${OPTARG}"
            ;;
        l)
            # latest? publishes to `latest-enterprise` demo server
            BUILD_AS_LATEST=true
            ;;
        w)
            # watch build status to break build
            WATCH_FOR_BUILD_STATUS=true
            ;;
        *)
            echo "Invalid falg: -$opt"
            ;;
    esac
done

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

stop_jenkins_build () {
    response=$(curl --write-out "%{http_code}\n" --silent --output /dev/null -X POST \
                "$JENKINS_URL/job/$JENKINS_JOB/$CURRENT_BUILD_NUMBER/stop"
              )
    echo $response
}

queue_jenkins_build () {
    response=$(curl --write-out "%{http_code}\n" --silent --output /dev/null -X POST \
                -H "Jenkins-Crumb:$JENKINS_CRUMB_TOKEN" \
                "$JENKINS_URL/job/$JENKINS_JOB/buildWithParameters?CONTAINER=enterprise&GIT_BRANCH=$BUILD_FROM&GIT_TAG=$BUILD_FROM&GIT_TAG_OR_BRANCH=$GIT_TAG_OR_BRANCH&BUILD_AS_LATEST=$BUILD_AS_LATEST&token=$JENKINS_JOB_TOKEN"\
              )
    echo $response
}

echo "Building $BUILD_FROM $GIT_TAG_OR_BRANCH as $([ $BUILD_AS_LATEST = true ] && echo 'latest-enterprise' || echo $BUILD_FROM-enterprise)..."

CURRENT_JOB_STATUS=`check_status`

if [[ "$CURRENT_JOB_STATUS" == "None" ]]; then
    CURRENT_BUILD_NUMBER=`get_build_number`
    echo "Job #$CURRENT_BUILD_NUMBER is already running. Aborting that job now..."
    RESP=`stop_jenkins_build`
    if [[ "$RESP" == "302" ]]; then
        echo "Successfully aborted job #$CURRENT_BUILD_NUMBER"
    else
        exit 1
        echo "ERROR: Request to Jenkins returned $RESP"
    fi
else
    echo "- adding Jenkins build to queue..."
fi

CRUMB=$(curl -s -X GET "$JENKINS_URL/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,%22:%22,//crumb)")
RESP=`queue_jenkins_build`

if [[ "$RESP" == "201" ]]; then
    echo "SUCCESS: Jenkins sucessfully queued job"
else
    exit 1
    echo "ERROR: Request to Jenkins returned $RESP"
fi

if [ $WATCH_FOR_BUILD_STATUS = true ]; then
    INITIAL_STATUS=`check_status`
    if [ -n $INITIAL_STATUS ]; then
        BUILD_STATUS=`check_status`
        CURRENT_BUILD_NUMBER=`get_build_number`
        echo -n "Watching build #$CURRENT_BUILD_NUMBER to report on status..."
        while [[ "$BUILD_STATUS" == "None" ]]; do
            sleep 10
            printf "."
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
            echo "" # new line
            echo "Build was ended with status: $BUILD_STATUS!"
            exit 1
        fi
    else
      echo "BUILD FAILURE: Other build is unsuccessful or status could not be obtained."
      exit 1
    fi
fi
