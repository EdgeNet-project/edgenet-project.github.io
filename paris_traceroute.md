---
---
# Conducting a Network Mapping Experiment on EdgeNet
In this tutorial, we're going to deploy a world-class network mapping system on EdgeNet, [Paris Traceroute](https://paris-traceroute.net/).
Paris Traceroute is designed to overcome the traditional limitations in [traceroute](https://en.wikipedia.org/wiki/Traceroute).  Specifically, classic traceoute fails when routers load-balance across multiple paths, a common Internet feature.  Paris Traceroute is a staple of modern network mapping, used by [M-Lab](https://www.measurementlab.net/) extensively. 

[Multi-level MDA-Lite Paris Traceroute](https://labs.ripe.net/Members/kevin_vermeulen/multilevel-mda-lite-paris-traceroute) is a form of traceroute with a Multi-path Detection Algorithm (MDA), which attempts to avoid as many redundant traceroute packets as possible. The inventors' aim is to reduce the packets necessary while also being confident they have mapped all of the path diversity.

## What You Will Do
The EdgeNet team at the [UPMC Sorbonne Universitès](http://www.upmc.fr/en/) and [PlanetLab Europe](https://www.planet-lab.eu/) has prepared a packaged version of Multi-level MDA Lite Paris Traceroute for easy deployment on EdgeNet, and a command-line client that can be run on your local machine to get measurements from *any* EdgeNet site.  You will:
1. Download the YAML file the EdgeNet team has prepared
2. Deploy it across EdgeNet
3. Use the command-line client to get measurement date


## Technologies You Will Use
The technologies that you will use are:

1. [Kubernetes](https://kubernetes.io/), to deploy the containers to the EdgeNet nodes
2.  [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to run measurements and (optionally) to do the deployment. 


## Prepare
Create account:
1. EdgeNet (see [Using EdgeNet](https://edge-net.org/using_EdgeNet.html)),
  making a note of your namespace
2. Install kubectl on your local machine.


## Get the Files to Deploy the Slice and Query Multi-level MDA Lite Paris Traceroute
1. The YAML file is at  [paris_traceroute.yaml](https://edge-net.org/downloads/paris_traceroute.yaml).
2. The shell script to query Paris Traceroute is at  [paris_traceroute.sh](https://edge-net.org/downloads/paris_traceroute.sh).  This is a convenience wrapper around a command line; if you don't want to use it, the command line `kubectl exec <container-name> -- bash -c "python3 multilevel-mda-lite/MDALite.py <ip address>"` will work.  If you use paris_traceroute.sh, the command line is `./paris_traceroute.sh <short-container-name> <ip-address>`

## Deploy the Service on EdgeNet

### Using the Dashboard

Log in to the [EdgeNet head node](https://headnode.edge-net.org/)
following the directions in [Using EdgeNet](https://edge-net.org/using_EdgeNet.html).
Once you are logged in and have chosen your namespace, you should
see this screen:

![Create Button](assets/images/createButton.png)

Click the Create Button in the top right.  You should see this
screen:

![Create](assets/images/create.png)

You can then "Create from Text Input" or "Create from File".  For either, use the file you downloaded, which will look like this: 

```yaml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: multilevel-mda-lite-paristraceroute
spec:
  template:
    metadata:
      labels:
        app: multilevel-mda-lite-paristraceroute
    spec:
      hostNetwork: true
      containers:
        - name: multilevel-mda-lite-paristraceroute
          image: bljuma/multilevel-mda-lite-paristraceroute
          command: [ "/bin/bash", "-c", "--" ]
          args: [ "while true; do sleep 30; done;" ]
```



The line `hostNetwork:true` tells Kubernetes to expose the ports from
the Pod.  A `DaemonSet` places a Pod on every node in EdgeNet.  The name of your application is `hello-world-new`, and
it will use the Docker image `bljuma/multilevel-mda-lite-paristraceroute` (an Ubuntu OS with `curl` installed).  It will then loop continuously, doing nothing.  That's where the `kubectl exec` comes in.

### Using kubectl

Put `paris_traceroute.yaml` in any convenient directory, and then, from the command line, run `$ kubectl apply -f paris_traceroute.yaml`.  To see your pods, run `$ kubectl get pods -o wide`.  For a full set of `kubectl` commands and options, see [Kubectl cheat sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#kubectl-context-and-configuration).


## Make Paris Traceroute do something
All the deployment has essentially done is set up measurement servers; to run an actual measurement, you must query the server.  Typically, this would be done by setting up a web server as a front end, which uses ports *very* quickly.  Fortunately, Kubernetes and Docker permit `ssh` access into a running container *over* the existing `kubectl` port, through `kubectl exec`.  `kubectl exec` takes two arguments: the name of the pod to execute the command, and the command itself.  The name of the pod will typically be `<deployment-name>-<hash>`; in our case, `multilevel-mda-lite-paristraceroute-6xfbd`, so a typical command would be `kubectl exec multilevel-mda-lite-paristraceroute-6xfbd "python3 multilevel-mda-lite/MDALite.py 8.8.8.8`.  `paris_traceoute.sh` simplifies this to `./paris_traceroute.sh <hash> <ip-address>`, e.g. `./paris_traceroute.sh 6xfbd 8.8.8.8`

The results will come out in text on your local machine.

