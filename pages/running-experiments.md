---
layout: page
title: Running Experiments
nav_order: 3
---

# Running experiments on EdgeNet

If you are familiar with [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/),
you already know how almost everything to deploy experiments on EdgeNet.
If not, you can rely on the wealth of documentation and tutorials already available online.
In this page, we describe the basic steps to run an experiment on EdgeNet, as well as the few specific EdgeNet features.

Keep in mind that EdgeNet goal is to provide a globally distributed testbed for network research.
For more informations on its intended uses, see the [Acceptable Use Policy]({{ site.baseurl }}{% link pages/usage-policy.md %}).

## Registering as a user

### Non-profit institutions

To run experiments on EdgeNet, you need an account on the platform.
We welcome anyone from non-profit institutions, including universities, research institutes, laboratories and government.
We simply require the contact informations of a permanent member of the institution (e.g. a professor).
If you hold a non-permanent position (e.g. a student or an intern), please provide the contact informations of you supervisor or manager.

To register, please follow the instructions at <https://console.edge-net.org/signup>.
We will verify your informations and send you your _kubeconfig_ file under 48 hours.

### For-profit institutions

If you are working at a for-profit institution, please contact us at <edgenet-support@planet-lab.eu>.

## Required tools

To follow this tutorial, you need to have [Docker](https://www.docker.com/) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
installed on your machine.

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

## Reconfiguring the experiment

## Stopping the experiment