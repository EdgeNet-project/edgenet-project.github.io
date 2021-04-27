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

To register, please follow the link below.
We will verify your informations and send you your _kubeconfig_ file under 48 hours.

[Create an EdgeNet account](https://console.edge-net.org/signup){: .btn .btn-blue }

### For-profit institutions

If you are working at a for-profit institution, please contact us at <edgenet-support@planet-lab.eu>.

## Prerequisites

To follow this tutorial, you need to have [Docker](https://www.docker.com/) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
installed on your machine.
You can find the installation instructions on their respective websites.
You will also need a free account on [Docker Hub](https://hub.docker.com/) to store your containers images.

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
docker build -t simple-experiment .
docker run -p 8080:80 -it simple-experiment
curl http://localhost:8080 # (In another terminal)
# <html><body>Hello World!</body></html>
```

Once we've tested our image, we can tag it and push it to the [Docker Hub](https://hub.docker.com/) registry.
To do so, start by [creating a repository](https://hub.docker.com/repository/create) on Docker Hub:

![Docker Hub - Create Repository]({{ site.baseurl }}/assets/images/docker-hub-repository.png)

Then run the following commands by replacing _username_ with your Docker Hub username:
```bash
docker login
docker tag simple-experiment username/simple-experiment:1.0
docker push username/simple-experiment:1.0
```

**Important:** Make sure that you build your image on an x86-64 machine.
If you build your image on an ARM machine (such as an Apple M1 CPU), the image will fail to run on EdgeNet nodes with the
message `exec user process caused "exec format error"`.

## Deploying containers

### Creating a slice

Kubernetes [workloads](https://kubernetes.io/docs/concepts/workloads/) cannot be directly created under the authority namespace on EdgeNet.
You need to create a slice first.
To do so, create the following `slice.yaml` file by replacing `your-authority` and `your-username` with the corresponding values.

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

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg apply -f deployment.yaml
```

See the next section for finding the pod names and forwarding the container port.

## Monitoring the experiment

We omit the `--kubeconfig` and `-n` options for brevity here.

```bash
# View the selective deployment (sd) status:
kubectl describe sd simple-experiment 
# View the daemon set (ds) status:
kubectl kubeconfig /path/to/kubeconfig.cfg -n your-authority-slice-your-username-1 \
  describe ds simple-experiment
# View the logs of a pod:
kubectl logs POD_NAME
# Forward the ports of a pod:
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

For more information, refer to the [Docker](https://docs.docker.com) and [Kubernetes](https://kubernetes.io/docs/concepts/) documentations.
