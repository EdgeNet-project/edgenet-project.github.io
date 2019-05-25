---
---
# Simple "Hello, World" on EdgeNet
In this tutorial, we're going to show you how to deploy a minimal
experiment across EdgeNet and use it.  This is a lighter version of
the standard "Hello, World", tutorial; it's designed so that all you need to do is download a
YAML file, then upload it to the Kubernetes dashboard on the headnode.

Though this is simpler than the original Hello, World tutorial, it is also ephemeral: we're
providing the server to catch the Hellos, and this won't always be up.

## What You Will Do
You will deploy a standard image  to EdgeNet nodes around the
world, which will execute a simple shell command to curl a webserver
with your name (which you'll pick) and the hostname.
You can then view your successful Hellos at the [server](http://princeton.edge-net.io:5000/show_hellos) or on a
[mapping page we've prepared](https://editor.engagelively.com/widgets/rick/merif-demo-hello-world).

## Technologies You Will Use
The technology that you will use is:

1. [Kubernetes](https://kubernetes.io/), to deploy the containers to the EdgeNet nodes


## Prepare
Create account:
1. EdgeNet (see [Using EdgeNet](https://edge-net.org/using_EdgeNet.html)),
  making a note of your namespace


## Get the File to Deploy the Slice
You have two choices: get a blank file and edit it yourself, or find a customized file in your browser.
1. To get the blank file, get <a href=https://edge-net.org/helloWorld.yaml download>helloWorld.yaml</a>.  You will need to change <username> in the last line to a nickname for yourself; please pick a good one.
2. To get the file filled out with your nickname, fill out the form [here](http://princeton.edge-net.io:5000/get_yaml) and copy it from your browser.



## Deploy a Service on EdgeNet
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
  name: hello-world-new
spec:
  template:
    metadata:
      labels:
        app: hello-world-new
    spec:
      hostNetwork: true           
      containers:
        - name: hello-world-new
          image: tutum/curl
          command: ["/bin/sh"]
          args: ["-c", "while true; do curl http://princeton.edge-net.io:5000/hello/$(hostname)/<nickname>; sleep 72000; done"]
```

Where  `<nickname>` is the name you chose/edited into the file.  

The line `hostNetwork:true` tells Kubernetes to expose the ports from
the Pod.  A `DaemonSet` places a Pod on every node in EdgeNet.  The name of your application is `hello-world-new`, and
it will use the Docker image `tutum/curl` (an Ubuntu OS with `curl` installed).  It will then execute the command
`/bin/sh -c "while true; do curl http://princeton.edge-net.io:5000/hello/$(hostname)/<nickname>; sleep 72000; done"`;
in other words, send a Hello to the server, sleep for a couple of hours, then send another (we assume you'll take down the slice after a single Hello from each node).

## Check out your Hellos
For a simple text presentation, talk to the server directly [here](http://princeton.edge-net.io:5000/show_hellos).  You can find 
a nicer graphical presentation on a
[mapping page we've prepared](https://editor.engagelively.com/widgets/rick/merif-demo-hello-world).


## Suggested Future Reading
Here are some starting points for you to further explore the
technologies used in this tutorial, and related technologies:
1. [Using EdgeNet](https://edge-net.org/using_EdgeNet.html)
2. [Docker Tutorial](https://docs.docker.com/get-started/)
3. [Hello, World in Kubernetes](https://kubernetes.io/docs/tutorials/hello-minikube/)
4. [Hello, Minikube](https://kubernetes.io/docs/tutorials/hello-minikube/);
5. [Full Hello, World Tutorial on EdgeNet](https://edge-net.org/hello_world.html)
  Minikube allows you to run Kubernetes on your local machine.

