# K8s manifests and documentation

## Secrets

```bash
# generate base64 strings
. ./secrets.sh

# paste them into secrets files and apply it
kubectl apply -f secrets --namespace=argo
```
