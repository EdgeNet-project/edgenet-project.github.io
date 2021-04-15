---
layout: page
title: Run an Experiment
nav_order: 3
---

# Running an experiment on EdgeNet

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

[Signup on the ](){: .btn .btn-blue }

To register, please follow the instructions at <https://console.edge-net.org/signup>.
We will verify your informations and send you your _kubeconfig_ file under 48 hours.

### For-profit institutions

If you are working at a for-profit institution, please contact us at <edgenet-support@planet-lab.eu>.

## Prerequisites

To follow this tutorial, you need to have [Docker](https://www.docker.com/) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
installed on your machine.
You can find the installation instructions on their respective websites.
You will also need a free account on [Docker Hub](https://hub.docker.com/) to store your containers images.

## Building a container image

Let's consider a simple scenario where we want to serve a static web page.
We will define two files in `simple-container` directory: the web page `index.html`, and the _Dockerfile_.

```bash
simple-container/
├── Dockerfile
└── index.html
```

The `index.html` file contains a minimal HTML page:
```html
<!-- index.html -->
<html><body>Hello World!</body></html>
```

The `Dockerfile` contains the instructions needed to build the container image.
We will use the Python built-in webserver to serve our page.
To do so, we start with an image from [Docker Hub](https://hub.docker.com/) with Python pre-installed:
```dockerfile
# Dockerfile
FROM python:latest
ADD index.html /data/index.html
CMD python3 -m http.server -d /data 80
```

We can then build and test our image locally:
```bash
docker build -t simple-container .
docker run -p 8080:80 -it simple-container
curl http://localhost:8080
# <html><body>Hello World!</body></html>
```

Once we've tested our image, we can tag it and push it to the [Docker Hub](https://hub.docker.com/) registry.
To do so, start by [creating a repository](https://hub.docker.com/repository/create) on Docker Hub:

![Docker Hub - Create Repository]({{ site.baseurl }}/assets/images/docker-hub-repository.png)

Then run the following commands by replacing _username_ with your Docker Hub username:
```bash
docker login
docker tag simple-container username/simple-container:v1.0
docker push username/simple-container:v1.0
```


## Deploying containers

### Creating a slice

```yaml
# slice.yaml
apiVersion: apps.edgenet.io/v1alpha
kind: Slice
metadata:
  name: playground-your-username
spec:
  type: Development
  profile: Medium
  users:
    - authority: your-authority
      username: your-username
```

### Creating a deployment

TODO: Describe selective deployments.

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
