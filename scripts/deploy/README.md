# K8s manifests and documentation

## Secrets

```bash
# generate base64 strings
. ./k8s/secrets.sh

# paste them into secrets files and apply it
kubectl apply -f k8s/secrets --namespace=argo
```
