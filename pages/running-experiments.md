---
layout: page
title: Run an Experiment
nav_order: 3
---

# Running an experiment on EdgeNet

If you are familiar with [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/),
you already know almost everything that you need to know to deploy experiments on EdgeNet.
If not, you can rely on the wealth of documentation and tutorials already available for these technologies online.
This page describes the basic steps required to run an experiment on EdgeNet, with attention to the few EdgeNet-specific features.

## Registering as a user

To run experiments on EdgeNet, you need an account on the platform.
We welcome bona fide researchers whose work will benefit from a global testbed that is open to the Internet.
Its value lies in its distributed vantage points rather than in raw compute power.
Kindly review the [Acceptable Use Policy]({{ site.baseurl }}{% link pages/usage-policy.md %}) for more details.

### Users at not-for-profit institutions

For researchers at not-for-profit institutions, including universities, research institutes, laboratories, and government,
we simply require the contact information of a permanent member of the institution, such as a professor or a senior researcher.
If you hold a non-permanent position, such as student or intern, please provide the contact information of your supervisor or manager.

To register, please follow the link below.
We will verify the information that you supply and, providing that all checks out, send you your _kubeconfig_ file within 48 hours.

[Create an EdgeNet account](https://console.edge-net.org/signup){: .btn .btn-blue }

If you expect the platform to be valuable to your research, we ask that you kindly support it by [contributing a node]({{ site.baseurl }}{% link pages/node-contribution.md %}) from your institution's premises or from a cloud provider.

### Users at for-profit institutions

EdgeNet welcomes pre-commercial research conducted by for-profit institutions.
You may obtain a trial account for free by following the not-for-profit registration instructions, above.
If you find that EdgeNet is valuable for your work, we ask that your institution kindly make a financial contribution to support the platform.
Please write to us at <edgenet-support@planet-lab.eu> so that we can discuss details.

## Prerequisites

To run an experiment, you need to have [Docker](https://www.docker.com/) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
installed on your machine.
You can find the installation instructions on their respective websites.
You will also need a free account on [Docker Hub](https://hub.docker.com/) to store your container images.

## Building a container image

Let's consider a simple scenario where we want to serve a static web page.
We will define two files in `simple-experiment` directory: the web page `index.html`, and the _Dockerfile_.

```bash
simple-experiment/
├── Dockerfile
└── index.html
```

The `index.html` file contains a minimal HTML page:
```html
<!-- index.html -->
<html><body>Hello World!</body></html>
```

The `Dockerfile` contains the instructions needed to build the container image.
We will use Python's built-in web server to serve the page.
Start with an image from [Docker Hub](https://hub.docker.com/) that has Python pre-installed:
```dockerfile
# Dockerfile
FROM python:latest
ADD index.html /data/index.html
CMD python3 -m http.server -d /data 80
```

We can then build and test our image locally:
```bash
docker build -t simple-experiment .
docker run -p 8080:80 -it simple-experiment
curl http://localhost:8080 # (In another terminal)
# <html><body>Hello World!</body></html>
```

Once we've tested our image, we can tag it and push it to the [Docker Hub](https://hub.docker.com/) registry.
To do so, first [create a repository](https://hub.docker.com/repository/create) on Docker Hub:

![Docker Hub - Create Repository]({{ site.baseurl }}/assets/images/docker-hub-repository.png)

Then run the following commands, replacing _username_ with your Docker Hub user name:
```bash
docker login
docker tag simple-experiment username/simple-experiment:1.0
docker push username/simple-experiment:1.0
```

**Important:** Make sure that you build your image on an x86-64 machine, as EdgeNet does not yet support Arm processors, such as the Apple M1 CPU.
If you build your image on an Arm machine, the image will fail to run on EdgeNet nodes and you will receive the message: `exec user process caused "exec format error"`.

## Deploying containers

### Creating a slice

Your EdgeNet account is associated with what we term an _authority_, which is the namespace in which you are allowed to work.
Within your authority namespace, you will create a _slice_ namespace for each Kubernetes [workload](https://kubernetes.io/docs/concepts/workloads/) that you intend to deploy.
To do so, prepare a `slice.yaml` file by replacing `your-authority` and `your-username` with the corresponding values in the following:

```yaml
# slice.yaml
apiVersion: apps.edgenet.io/v1alpha
kind: Slice
metadata:
  name: your-username-1
  namespace: your-authority
spec:
  type: Development
  profile: Medium
  users:
    - authority: your-authority
      username: your-username
```

Then run:
```bash
kubectl apply --kubeconfig /path/to/kubeconfig.cfg -f slice.yaml
```

### Creating a deployment

Here is an example `deployment.yaml` file:

```yaml
# deployment.yaml
apiVersion: apps.edgenet.io/v1alpha
kind: SelectiveDeployment
metadata:
  name: simple-experiment
  namespace: your-authority-slice-your-username-1
spec:
  workloads:
    daemonset:
      - apiVersion: apps/v1
        kind: DaemonSet
        metadata:
          name: simple-experiment
          namespace: your-authority-slice-your-username-1
          labels:
            app: simple-experiment
        spec:
          selector:
            matchLabels:
              app: simple-experiment
          template:
            metadata:
              labels:
                app: simple-experiment
            spec:
              containers:
                - name: simple-experiment
                  image: username/simple-experiment:1.0
                  ports:
                    - containerPort: 80
                  resources:
                    limits:
                      cpu: 100m
                      memory: 125Mi
                    requests:
                      cpu: 100m
                      memory: 125Mi
  selector:
    - value:
        - North_America
        - Europe
      operator: In
      quantity: 5
      name: Continent
```

And here is the command to launch it (provide the correct path to your `kuheconfig` file):

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg apply -f deployment.yaml
```

## Monitoring the experiment

These commands allow you to find the pod names and to forward the container port.
We omit the `--kubeconfig` and `-n` options for brevity here.

View the selective deployment (sd) status:

```bash
kubectl describe sd simple-experiment 
```

View the daemon set (ds) status:

```bash
kubectl kubeconfig /path/to/kubeconfig.cfg -n your-authority-slice-your-username-1 \
  describe ds simple-experiment
```

View the logs of a pod:

```bash
kubectl logs POD_NAME
```

Forward the ports of a pod:

```bash
kubectl port-forward POD_NAME 8080:80
```

## Stopping the experiment

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg delete -f deployment.yaml
```

## Tips

To avoid passing `--kubeconfig` on each command, you can copy your kubeconfig file to `$HOME/.kube/config`,
or export the `KUBECONFIG` variable.
For example, `export KUBECONFIG=/home/user/Downloads/kubeconfig.cfg`.

To avoid passing `-n/--namespace` on each command, you can use a tool like [kubectx](https://github.com/ahmetb/kubectx).

## Going further

For more information, please refer to the [Docker](https://docs.docker.com) and [Kubernetes](https://kubernetes.io/docs/concepts/) documentation.
