# K8s manifests and documentation

## Secrets

```bash
kubectl create secret generic gitconfig --from-file=gitconfig=./.gitconfig --namespace=argo
```
