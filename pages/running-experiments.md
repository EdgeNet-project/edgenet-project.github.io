---
layout: page
title: Running an Experiment
nav_order: 2
---

# Running an experiment on EdgeNet

If you are familiar with [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/),
you already know almost everything that you need to know to deploy experiments on EdgeNet.
If not, you can rely on the wealth of documentation and tutorials already available for these technologies online.
This page describes the basic steps required to run an experiment on EdgeNet, 
with attention to the few EdgeNet-specific features:
user registration, user namespaces and selective deployments.

### CPU architecture

EdgeNet supports both nodes with ARM64 and x86-64 CPUs.
If the binaries in your image do not match the target node architecture, it will fail to run with the message: `exec user process caused "exec format error"`.
For example, if you build a C++ program in your Dockerfile, this program will by default be compiled for the architecture of your machine:
If you're running Docker on an Intel MacBook, it will produce an x86-64 binary, while if you run it on an M1 MacBook, it will produce an ARM64 binary.

Docker also supports building multi-architecture image on a single machine, by emulating the target CPUs architecture.
The following tutorials provides more information:
- [Building Multi-Arch Images for Arm and x86 with Docker Desktop](https://www.docker.com/blog/multi-arch-images/)
- [Continuous Cross-Architecture Integration with GitLab](https://community.arm.com/developer/research/b/articles/posts/continuous-cross-architecture-integration-with-gitlab)

## Deploying containers

### Creating a pod

Here is an example `deployment.yaml` file:

```yaml
# deployment.yaml
apiVersion: apps.edgenet.io/v1alpha
kind: SelectiveDeployment
metadata:
  name: simple-experiment
  namespace: your-tenant
spec:
  workloads:
    daemonset:
      - apiVersion: apps/v1
        kind: DaemonSet
        metadata:
          name: simple-experiment
          namespace: your-tenant
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

And here is the command to launch it (provide the correct path to your `kubeconfig` file):

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg apply -f deployment.yaml
```

## Monitoring the experiment

These commands allow you to find the pod names and to forward the container port.
We omit the `--kubeconfig` and `-n` options for brevity here.

View the selective deployment (sd) status:

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg -n your-tenant \
    describe sd simple-experiment 
```

View the daemon set (ds) status:

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg -n your-tenant \
  describe ds simple-experiment
```

View the logs of a pod:

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg -n your-tenant \
    logs POD_NAME
```

Forward the ports of a pod:

```bash
kubectl --kubeconfig /path/to/kubeconfig.cfg -n your-tenant \
    port-forward POD_NAME 8080:80
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
