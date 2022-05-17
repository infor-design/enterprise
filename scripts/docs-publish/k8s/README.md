# K8s manifests and documentation

## Secrets

```bash
kubectl create secret generic github --from-file=github_rsa=./github_rsa --namespace=argo
kubectl create secret generic npm --from-file=secrets=./secrets --namespace=argo
```
