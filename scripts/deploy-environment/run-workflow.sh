#!/bin/bash

while getopts ":u:o:c:f:l:n:i:a:m:s:" opt; do
  case $opt in
    u) AWF_URL="$OPTARG"
    ;;
    o) ORG_NAME="$OPTARG"
    ;;
    c) BASE_CONTAINER_NAME="$OPTARG"
    ;;
    f) BUILD_FROM="$OPTARG"
    ;;
    n) SERVICE_NAME="$OPTARG"
    ;;
    i) IMAGE_VERSION="$OPTARG"
    ;;
    a) APP_REPO="$OPTARG"
    ;;
    m) MANIFESTS_REPO="$OPTARG"
    ;;
    s) SITE="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    exit 1
    ;;
  esac

  case $OPTARG in
    -*) echo "Option $opt needs a valid argument"
    exit 1
    ;;
  esac
done

check_status(){
  AWF_NAME=$1
  status_resp=$(curl -k --location --request GET --header "Authorization: Bearer $AWF_AUTH_TOKEN" "$AWF_URL/v1/workflows/argo/$AWF_NAME")
  echo $(jq .status.phase <<< ${status_resp})
}

run_resp=$(
  curl -k --location --request POST "$AWF_URL/v1/workflows/argo/submit" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer $AWF_AUTH_TOKEN" \
    --data-raw '{
      "namespace": "argo",
      "resourceKind": "WorkflowTemplate",
      "resourceName": "'$AWF_NAME'",
      "submitOptions": {
        "entryPoint": "ent-env-deploy-wf",
        "generateName": "enterprise-demo-deploy",
        "labels": "submit-from-rest=true",
        "parameters": [
          "org_name='$ORG_NAME'",
          "base_container_name='$BASE_CONTAINER_NAME'",
          "build_from='$BUILD_FROM'",
          "service_name='$SERVICE_NAME'",
          "image_version='$IMAGE_VERSION'",
          "app_repo='$APP_REPO'",
          "manifests_repo='$MANIFESTS_REPO'",
          "site='$SITE'"
        ]
      }
    }'
)

echo $run_resp

_AWF_NAME=$(echo $(jq .metadata.name <<< ${run_resp}) | tr -d '"')
sleep 5
status_resp=$(check_status $_AWF_NAME)
WORKFLOW_STATUS=$(echo $status_resp | tr -d '"')

while [[ $WORKFLOW_STATUS == "Running" ]]; do
  echo "Still $WORKFLOW_STATUS"
  sleep 25
  status_resp=$(check_status $_AWF_NAME)
  WORKFLOW_STATUS=$(echo $status_resp | tr -d '"')
done

if [[ $WORKFLOW_STATUS == "Succeeded" ]]
then
  echo "Finished successfully!"
  exit 0
fi

echo "Something went wrong..."
exit 1
