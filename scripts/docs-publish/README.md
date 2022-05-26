# K8s manifests and documentation

## Secrets

```bash
# generate base64 strings
. secrets.sh

# paste them into secrets.yaml and apply it
kubectl apply -f secrets.yaml --namespace=argo
```
