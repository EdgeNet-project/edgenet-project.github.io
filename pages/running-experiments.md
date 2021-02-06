---
layout: page
title: Running Experiments
nav_order: 3
---

# Running experiments on EdgeNet

## Registering as a user

To run experiments on EdgeNet you need to register.  
Please follow the instructions at <https://console.edge-net.org/signup>.

## Building a container

Let's consider the simple scenario where we want to serve a static web page:
```bash
simple-container/
├── Dockerfile
└── index.html
```

```dockerfile
# Dockerfile
FROM python:latest
ADD index.html /data/index.html
CMD python3 -m http.server -d /data 80
```

```html
<!-- index.html -->
<html><body>Hello World!</body></html>
```

```bash
docker build -t simple-container .
```

```bash
docker run -p 8080:80 -it simple-container
curl http://localhost:8080
# <html><body>Hello World!</body></html>
```

## Deploying a container

```yaml
# deployment.yaml
apiVersion: apps.edgenet.io/v1alpha
kind: SelectiveDeployment
metadata:
  name: city-all
spec:
  controller:
    - type: Deployment
      name: deployment1
  type: City
  selector:
    - value: Paris`
      operator: In
      count: 0
    - value: Los_Angeles
      operator: In
      count: 0
```

```bash
kubectl apply -f deployment.yaml
```