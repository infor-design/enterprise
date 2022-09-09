# K8s manifests and documentation

## Create secrets

```bash
# generate base64 strings
. ./k8s/secrets.sh

# paste them into secrets files and apply it
kubectl apply -f k8s/secrets --namespace=argo
```

## Run a job

```bash
kubectl apply -f job.yaml --namespace=argo
```
