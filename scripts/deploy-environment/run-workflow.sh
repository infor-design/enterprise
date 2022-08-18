#!/bin/bash

AWF_URL=$1
AWF_TEMPLATE_ID=$2
HANDLER_API_URL=$3
ORG_NAME=$4
BASE_CONTAINER_NAME=$5
BUILD_FROM=$6
REPO_OWNER_NAME=$7

check_status(){
  WORKFLOW_NAME=$1
  status_resp=$(curl -k --location --request GET --header "Authorization: Bearer $AWF_AUTH_TOKEN" "$AWF_URL/v1/workflows/argo/$WORKFLOW_NAME")
  echo $(jq .status.phase <<< ${status_resp})
}

run_resp=$(
  curl -k --location --request POST "$AWF_URL/v1/workflows/argo/submit" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer $AWF_AUTH_TOKEN" \
    --data-raw '{
      "namespace": "argo",
      "resourceKind": "WorkflowTemplate",
      "resourceName": "'$AWF_TEMPLATE_ID'",
      "submitOptions": {
        "entryPoint": "env-deploy-wf",
        "generateName": "enterprise-demo-deploy",
        "labels": "submit-from-rest=true",
        "parameters": [
          "handler_api_url='$HANDLER_API_URL'",
          "org_name='$ORG_NAME'",
          "base_container_name='$BASE_CONTAINER_NAME'",
          "build_from='$BUILD_FROM'",
          "repo_owner_name='$REPO_OWNER_NAME'"
        ]
      }
    }'
)

WORKFLOW_NAME=$(echo $(jq .metadata.name <<< ${run_resp}) | tr -d '"')
sleep 5
status_resp=$(check_status $WORKFLOW_NAME)
WORKFLOW_STATUS=$(echo $status_resp | tr -d '"')

while [[ $WORKFLOW_STATUS == "Running" ]]; do
  echo "Still $WORKFLOW_STATUS"
  sleep 25
  status_resp=$(check_status $WORKFLOW_NAME)
  WORKFLOW_STATUS=$(echo $status_resp | tr -d '"')
done

if [[ $WORKFLOW_STATUS == "Succeeded" ]]
then
  echo "Finished successfully!"
  exit 0
fi

echo "Something went wrong..."
exit 1
