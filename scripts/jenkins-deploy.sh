#!/bin/dash

JENKINS_USER="Jenkins"
JENKINS_DOMAIN="jenkins.design.infor.com:8080"
JENKINS_JOB="soho-kubernetes-deploy"
JENKINS_URL="http://$JENKINS_USER:$JENKINS_API_TOKEN@$JENKINS_DOMAIN"

BUILD_FROM="main"
BUILD_AS_LATEST=false
WATCH_FOR_BUILD_STATUS=false
QUEUE_BUILD=false

while getopts "b:lwq" opt; do
    case $opt in
        b)
            # the branch or tag name to build from
            BUILD_FROM="${OPTARG}"
            ;;
        l)
            # latest? publishes to `latest-enterprise` demo server
            BUILD_AS_LATEST=true
            ;;
        q)
            # Add to queue instead of cancelling existing build
            QUEUE_BUILD=true
            ;;
        w)
            # watch build status to break build
            WATCH_FOR_BUILD_STATUS=true
            ;;
        *)
            exit 1
            ;;
    esac
done

if [ -z "$JENKINS_API_TOKEN" ]; then echo "JENKINS_API_TOKENx must be defined"; exit 1; fi
if [ -z "$JENKINS_JOB_TOKEN" ]; then echo "JENKINS_JOB_TOKEN must be defined"; exit 1; fi

_check_credentials() {
    response=$(curl --write-out "%{http_code}\n" --silent --output /dev/null \
                "$JENKINS_URL/job/$JENKINS_JOB/lastBuild/api/json"
              )
    if [ "$response" = "200" ]; then
        echo "Successfully authenticated..."
    else
        echo "ERROR: Authorization to Jenkins returned $response"
        echo $(curl -s $JENKINS_URL/job/$JENKINS_JOB/lastBuild/api/json)
        exit 1
    fi
}

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

get_build_log () {
    build_log=$(curl -s $JENKINS_URL/job/$JENKINS_JOB/lastBuild/consoleText)
    echo "$build_log"
}

stop_jenkins_build () {
    response=$(curl --write-out "%{http_code}\n" --silent --output /dev/null -X POST \
                "$JENKINS_URL/job/$JENKINS_JOB/$CURRENT_BUILD_NUMBER/stop"
              )
    echo $response
}

queue_jenkins_build () {
    crumb=$(curl -s -X GET "$JENKINS_URL/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,%22:%22,//crumb)")
    response=$(curl --write-out "%{http_code}\n" --silent --output /dev/null -X POST \
                -H "Jenkins-Crumb:$crumb" \
                "$JENKINS_URL/job/$JENKINS_JOB/buildWithParameters?CONTAINER=enterprise&BUILD_FROM=$BUILD_FROM&BUILD_AS_LATEST=$BUILD_AS_LATEST&token=$JENKINS_JOB_TOKEN"\
              )
    echo $response
}

_check_credentials

build_number_url=$(echo $BUILD_FROM | sed -e 's/\.//g')

echo "Building $BUILD_FROM as $([ "$BUILD_AS_LATEST" = true ] && echo 'latest-enterprise' || echo $build_number_url-enterprise)..."

CURRENT_JOB_STATUS=`check_status`

if [ "$CURRENT_JOB_STATUS" = "None" ]; then
    if [ "$QUEUE_BUILD" = false ]; then
        CURRENT_BUILD_NUMBER=`get_build_number`
        echo "Job #$CURRENT_BUILD_NUMBER is already running. Aborting that job now..."
        RESP=`stop_jenkins_build`
        if [ "$RESP" = "302" ]; then
            echo "Successfully aborted job #$CURRENT_BUILD_NUMBER"
        else
            exit 1
            echo "ERROR: Request to Jenkins returned $RESP"
        fi
    else
        echo "- adding Jenkins build to queue..."
    fi
else
    echo "- adding Jenkins build to queue..."
fi

RESP=`queue_jenkins_build`

if [ "$RESP" = "201" ]; then
    echo "SUCCESS: Jenkins sucessfully queued job"
else
    exit 1
    echo "ERROR: Request to Jenkins returned $RESP"
fi
