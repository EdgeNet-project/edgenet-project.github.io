---
---
# Tutorial: A Set of Remote Login EdgeNet Containers 
A main value proposition of EdgeNet is that it provides nodes that are
scattered across the internet, offering both topological and geographic
diversity. This tutorial focuses on the user whose workflow consists of
logging into containers and launching tools at the command line. An
archetypal user of this sort is a student in a computer networking course
who is carrying out lab exercises in network measurements. They want to conduct
pings and traceroutes from a variety of vantage points.

In this tutorial, you will create a Kubernetes pod that consists of a simple
container in which you will install the `traceroute` tool. You will
deploy replicas of the pod across EdgeNet. You will then be able to log into
these replicas and conduct pings (natively installed) and traceroutes.

## What You Will Do and What You Will Learn
You will create a vanilla CentOS container and install the 
`traceroute` tool in it. You will deploy this container to EdgeNet nodes
around the world. You will then log in to one or more containers and
conduct measurements from the vantage points that they provide.

Following this tutorial, you will have the skills necessary to create
a Linux container, install the software that you like via a package
manager, and save the container as a Docker image for later deployment.
You will be able to deploy that image and log into instances of it
and use the software from each instance.

## Technologies That You Will Use
The technologies that you will use are:

1. [Docker](https://www.docker.com/), to create your container
2. [RPM](https://rpm.org/), to install the software in the container 
3. [Kubernetes](https://kubernetes.io/), to deploy the containers to the EdgeNet nodes

## Prepare
Create accounts:
1. EdgeNet (see [Using EdgeNet](https://edge-net.org/using_EdgeNet.html)),
  making a note of your namespace
2. [Docker Hub](https://hub.docker.com/), a convenient place from which
  to pull Docker images onto your services

Install software:
1. [Docker](https://www.docker.com/) to launch Docker operations from
  the command line.
2. [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  to control a Kubernetes cluster from the command line

Download and test:
1. Download your config file from the portal (see [Using EdgeNet](https://edge-net.org/using_EdgeNet.html)
  and save a copy as `$HOME/.kube/config`. Create the `.kube` directory,
  which is where Kubernetes looks for a configuration file, if you do not
  already have one.
2. Run `$ kubectl get ns` to make sure that you're talking to the right cluster.

## Create Your Container

* Start Docker on your computer.
* Log in to Docker Hub, if starting Docker did not already log you in.
* At the command line, create a CentOS container with `docker create centos`.

The name `centos` identifies the [latest version of the official CentOS build](https://hub.docker.com/_/centos/) in the Docker Hub official repository. You will see output like the following while Docker downloads and prepares the image:

```
$ docker create centos
Unable to find image 'centos:latest' locally
latest: Pulling from library/centos
256b176beaff: Pull complete
Digest: sha256:6f6d986d425aeabdc3a02cb61c02abb2e78e57357e92417d6d58332856024faf
Status: Downloaded newer image for centos:latest
fb01e9909aad5525c2fc3921654e6bb2a030d26ae8b24351f68732ca376920c1
$
```

You should now be able to see the image amongst your Docker images in a listing like the following:

```
$ docker images
REPOSITORY                         TAG                 IMAGE ID            CREATED             SIZE
centos                             latest              5182e96772bf        13 days ago         200MB
perfsonar/testpoint                latest              ca3e8e2af3db        2 months ago        919MB
node                               4.4                 93b396996a16        2 years ago         648MB
$
```

## Run Your Container Locally

* At the command line, run the CentOS image with a Bash shell: `docker run -dit centos`.
* Verify that it is running and obtain its container ID by examining the output of `docker ps`.
* Log into your container with `docker attach <container ID>`, substituting the container ID for `<container ID>`.

Here is an example of a session in which we run the container, log into it, check the system version, and detach using Ctrl-p Ctrl-q (key strokes not visible) so as not to kill the Bash shell:

```
$ docker run -dit centos
8922cd313f377e59cc6030f73a12d4b7a100151c00aff7447073b2d7c6326db5
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
8922cd313f37        centos              "/bin/bash"         6 seconds ago       Up 5 seconds                            quizzical_yonath
$ docker attach 8922cd313f37
[root@8922cd313f37 /]# cat /etc/system-release
CentOS Linux release 7.5.1804 (Core)
[root@8922cd313f37 /]#
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS               NAMES
8922cd313f37        centos              "/bin/bash"         About a minute ago   Up About a minute                       quizzical_yonath
$
```

If you are curious about the command line options for `docker run`: 
* `-d` starts the image in "detached mode". If you were to run the container without this option, you would be logged into it directly.
* `-t` and `-i` together allocate a tty as the primary process and keep STDIN open. By default in this case, the tty provides a Bash shell.

With Docker, if a container's primary process ever stops, the container stops as well. If you were to run the CentOS image without a primary process, say via `docker run -d centos`, it would stop right away. Similarly, if you were to detach from the container with an `exit` command instead of Ctrl-p Ctrl-q, the container would stop.

## Install `traceroute`

In what follows, you'll want to be careful not to kill your running container, so as not to lose your work.

* If not already logged in to the container, do so now with `docker attach <container ID>`, using the container ID that you see in `docker ps` output.
* At the command line in the container, install traceroute: `yum install -y traceroute`. The `-y` option automatically accepts all default options so you will not need to reply to interactive queries during installation.
* Try out traceroute with a command like `traceroute google.com`.

Your installation of traceroute should look much like this:
```
traceroute:[root@8922cd313f37 /]# yum install -y traceroute
Loaded plugins: fastestmirror, ovl
Determining fastest mirrors
 * base: linux.cc.lehigh.edu
 * extras: centos.mirror.constant.com
 * updates: mirror.umd.edu
base                                                                                                                                                     | 3.6 kB  00:00:00
extras                                                                                                                                                   | 3.4 kB  00:00:00
updates                                                                                                                                                  | 3.4 kB  00:00:00
(1/4): extras/7/x86_64/primary_db                                                                                                                        | 174 kB  00:00:00
(2/4): base/7/x86_64/group_gz                                                                                                                            | 166 kB  00:00:00
(3/4): updates/7/x86_64/primary_db                                                                                                                       | 5.0 MB  00:00:01
(4/4): base/7/x86_64/primary_db                                                                                                                          | 5.9 MB  00:00:06
Resolving Dependencies
--> Running transaction check
---> Package traceroute.x86_64 3:2.0.22-2.el7 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

================================================================================================================================================================================
 Package                                    Arch                                   Version                                           Repository                            Size
================================================================================================================================================================================
Installing:
 traceroute                                 x86_64                                 3:2.0.22-2.el7                                    base                                  59 k

Transaction Summary
================================================================================================================================================================================
Install  1 Package

Total download size: 59 k
Installed size: 92 k
Downloading packages:
warning: /var/cache/yum/x86_64/7/base/packages/traceroute-2.0.22-2.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Public key for traceroute-2.0.22-2.el7.x86_64.rpm is not installed
traceroute-2.0.22-2.el7.x86_64.rpm                                                                                                                       |  59 kB  00:00:00
Retrieving key from file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
Importing GPG key 0xF4A80EB5:
 Userid     : "CentOS-7 Key (CentOS 7 Official Signing Key) <security@centos.org>"
 Fingerprint: 6341 ab27 53d7 8a78 a7c2 7bb1 24c6 a8a7 f4a8 0eb5
 Package    : centos-release-7-5.1804.1.el7.centos.x86_64 (@Updates)
 From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : 3:traceroute-2.0.22-2.el7.x86_64                                                                                                                             1/1
  Verifying  : 3:traceroute-2.0.22-2.el7.x86_64                                                                                                                             1/1

Installed:
  traceroute.x86_64 3:2.0.22-2.el7

Complete!
[root@8922cd313f37 /]#
```

And here is a run of `traceroute` (yours will certainly differ):
```
[root@8922cd313f37 /]# traceroute google.com
traceroute to google.com (172.217.12.142), 30 hops max, 60 byte packets
 1  gateway (172.17.0.1)  0.072 ms  0.049 ms  0.094 ms
 2  192.168.1.1 (192.168.1.1)  5.792 ms  5.592 ms  5.757 ms
 3  * * *
 4  agg63.ulpkny0101h.nyc.rr.com (24.164.160.40)  502.109 ms  501.951 ms  501.897 ms
 5  agg27.nwbrnycx01r.nyc.rr.com (24.164.165.126)  39.668 ms  36.048 ms  39.866 ms
 6  agg64.nyclnyrg01r.nyc.rr.com (24.164.164.252)  46.686 ms  35.031 ms  39.204 ms
 7  bu-ether29.nwrknjmd67w-bcr00.tbone.rr.com (107.14.19.24)  39.238 ms bu-ether19.nwrknjmd67w-bcr00.tbone.rr.com (66.109.6.78)  35.778 ms bu-ether29.nwrknjmd67w-bcr00.tbone.rr.com (107.14.19.24)  40.347 ms
 8  bu-ether12.nycmny837aw-bcr00.tbone.rr.com (66.109.6.27)  99.508 ms 66.109.5.138 (66.109.5.138)  85.996 ms  82.777 ms
 9  0.ae0.pr0.nyc20.tbone.rr.com (66.109.6.157)  71.002 ms 0.ae4.pr0.nyc20.tbone.rr.com (66.109.1.35)  79.712 ms 0.ae1.pr0.nyc20.tbone.rr.com (66.109.6.163)  75.261 ms
10  ix-ae-10-0.tcore1.n75-new-york.as6453.net (66.110.96.13)  74.470 ms ix-ae-6-0.tcore1.n75-new-york.as6453.net (66.110.96.53)  74.611 ms ix-ae-10-0.tcore1.n75-new-york.as6453.net (66.110.96.13)  74.187 ms
11  72.14.195.232 (72.14.195.232)  69.966 ms  21.187 ms  27.020 ms
12  108.170.248.97 (108.170.248.97)  24.544 ms  23.546 ms  31.663 ms
13  108.170.227.209 (108.170.227.209)  31.387 ms 108.170.227.211 (108.170.227.211)  23.713 ms 108.170.227.209 (108.170.227.209)  31.395 ms
14  lga34s19-in-f14.1e100.net (172.217.12.142)  30.814 ms  30.702 ms  28.360 ms
[root@8922cd313f37 /]#
```


XXX




## Build, Test, and Push the Docker File
The next step is to containerize the *Hello, World* application, test it,
and push it to Docker Hub so it can be loaded.  In the same directory,
write the following markup:

```bash
FROM node:4.4
EXPOSE 8080
COPY server.js .
CMD node server.js
```

_Note_: in the above, change 8080 to whatever random port you picked for your server.  Save this into `dockerfile` (note: no extension) and run:

```bash
$ docker build -t  <username>/edgenet-helloworld .
```

where `<username>` is your Docker Hub user name.

Once the build has been successfully completed, we're ready to test.
On your local host, run:

```bash
$ docker run -p 8080:8080 -d  <username>/edgenet-helloworld
```

As always, substitute the random port number you chose for 8080 in the
above.  Make sure the container is  running with `docker ps`.  You
should see something like:

```bash
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS              PORTS                    NAMES
67b44219b1a4        geeproject/edgenet-helloworld   "/bin/sh -c 'node se…"   27 hours ago        Up 27 hours         0.0.0.0:8080->8080/tcp   pensive_austin
```

If this is all working, repeat the test in your browser and/or with
`curl`.  When you see `Hello, World, from foo!`, kill the container with

```bash
$ docker stop 67b4
```

(substitute the first few digits of your container ID from the
`$ docker ps` command above).

Finally, push your container to Docker Hub.  Run:

```bash
$ docker push <username>/edgenet-helloworld
```

to push to Docker Hub.

## Deploy a Service on EdgeNet
Log in to the [EdgeNet head node](https://headnode.edge-net.org/)
following the directions in [Using EdgeNet](https://edge-net.org/using_EdgeNet.html).
Once you are logged in and have chosen your namespace, you should
see this screen:

![Create Button](assets/images/createButton.png)

Click the Create Button in the top right.  You should see this
screen:

![Create](assets/images/create.png)

Enter the following YAML code into the text box:

```yaml
apiVersion: extensions/v1beta1
kind: ReplicaSet
metadata:
  name: hello-world
spec:
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      hostNetwork: true           
      containers:
        - name: hello-world
          image: <username>/edgenet-helloworld
          ports:
          - containerPort: <your port>
            hostPort: <your port>
```

Where, as always, `<username>` is your Docker Hub username and `<your port>`
is the random port you've chosen.  Hit `Upload`.

The line `hostNetwork:true` tells Kubernetes to expose the ports from
the Pod.  A `ReplicaSet` is a number of Pods placed in the cluster; in
this case, we have chosen one, and since we didn't specify where this
should be placed it will be placed at a node chosen by Kubernetes.  You
should now see this:

![Deployed](assets/images/replica_set_deployed.png).

Supposing the node is `toronto.edge-net.io` as shown above, you can now
test with any browser by navigating to
`http://toronto.edge-net.io:<port-number>/hello?hostname=Toronto` or
with

```bash
$ curl http://toronto.edge-net.io:<port-number>/hello?hostname=Toronto
```

And get "Hello, World, from Toronto!"

Clicking on the links and menus will give you various views into your
ReplicaSet.  Play around with them and see what you can find out.  When
you're done, choose `Delete` from the right-hand menu in ReplicaSets.

![Delete](assets/images/delete.png)

It may take a few minutes to delete.

## A DaemonSet and Using `kubectl`
In this last section we're going to make `hello-world` run on _every_
node in EdgeNet.  And it's just as easy as it was to run on a single
node.

Once again, go to the EdgeNet dashboard and click the `Create` button in
the top right.  This time, when the wizard comes up, enter this YAML
code into the text box:

```yaml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: hello-world
spec:
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      hostNetwork: true           
      containers:
        - name: hello-world
          image: <username>/edgenet-helloworld
          ports:
          - containerPort: <your port>
            hostPort: <your port>
```

Notice that the change from our previous YAML is _one word_: DaemonSet
replaces ReplicaSet.  But this gives a dramatic change in result, as
we'll see.  Click `Upload`.  You will now see this:
![DaemonSet](assets/images/daemon_set.png).

_24 pods running, one on
every active EdgeNet node!_.  Of course, to test this we don't want to
manually type in every one, so we'll download the names of the nodes
using `kubectl`.

In a terminal window, type

```bash
$ kubectl get pods -o wide
```

You'll get an output like this:

```bash
NAME                READY     STATUS    RESTARTS   AGE       IP                                      NODE
hello-world-2l6t7   1/1       Running   0          4m        192.1.242.153                           gpo.edge-net.io
hello-world-57sl4   1/1       Running   0          4m        72.36.65.80                             illinois.edge-net.io
hello-world-6qn5z   1/1       Running   0          4m        10.103.0.13                             ufl.edge-net.io
hello-world-7984p   1/1       Running   0          4m        10.103.0.2                              waynestate.edge-net.io
hello-world-7dw4r   1/1       Running   0          4m        10.103.0.3                              osf.edge-net.io
hello-world-glxgz   1/1       Running   0          4m        10.103.0.2                              wv.edge-net.io
hello-world-hhsrp   1/1       Running   0          4m        137.110.252.67                          ucsd.edge-net.io
hello-world-kdp9w   1/1       Running   0          4m        199.109.64.50                           nysernet.edge-net.io
hello-world-lfpt4   1/1       Running   0          4m        10.103.0.10                             uh.edge-net.io
hello-world-lkgzf   1/1       Running   0          4m        66.104.96.101                           ohio.edge-net.io
hello-world-m6lrv   1/1       Running   0          4m        149.165.249.129                         indiana.edge-net.io
hello-world-mq5cn   1/1       Running   0          4m        204.102.244.69                          cenic.edge-net.io
hello-world-mw6qn   1/1       Running   0          4m        10.12.9.4                               toronto-core.edge-net.io
hello-world-nbjmn   1/1       Running   0          4m        10.2.9.3                                toronto.edge-net.io
hello-world-nk5qs   1/1       Running   0          4m        104.141.5.26                            louisiana.edge-net.io
hello-world-nrs2p   1/1       Running   0          4m        193.190.127.165                         iminds.edge-net.io
hello-world-prfqj   1/1       Running   0          4m        204.102.228.172                         nps.edge-net.io
hello-world-q2k4w   1/1       Running   0          4m        10.103.0.10                             node-0
hello-world-qgtcp   1/1       Running   0          4m        192.41.233.55                           umich.edge-net.io
hello-world-qtwk6   1/1       Running   0          4m        2001:660:3302:287b:21e:67ff:fe06:a2a8   france.edge-net.io
hello-world-rmgr2   1/1       Running   0          4m        130.127.215.147                         clemson.edge-net.io
hello-world-sbvdz   1/1       Running   0          4m        192.86.139.67                           nyu.edge-net.io
hello-world-t6pwq   1/1       Running   0          4m        165.124.51.203                          northwestern.edge-net.io
hello-world-xfrch   1/1       Running   0          4m        128.171.8.122                           hawaii.edge-net.io
```

`kubectl` is an extremely flexible and powerful tool to query and manage
your deployments and interaction with EdgeNet.  We can simply pipe this
into a file and do some editing, but fortunately `kubectl` will do a lot
of the work for us:

```bash
$ kubectl get pods -o=custom-columns=node:.spec.nodeName
node
illinois.edge-net.io
ufl.edge-net.io
waynestate.edge-net.io
osf.edge-net.io
wv.edge-net.io
ucsd.edge-net.io
nysernet.edge-net.io
uh.edge-net.io
ohio.edge-net.io
indiana.edge-net.io
cenic.edge-net.io
toronto-core.edge-net.io
toronto.edge-net.io
louisiana.edge-net.io
iminds.edge-net.io
nps.edge-net.io
node-0
umich.edge-net.io
france.edge-net.io
clemson.edge-net.io
nyu.edge-net.io
northwestern.edge-net.io
hawaii.edge-net.io
```

Just the node names!  That's what we need.  Now let's put them in a file:

```bash
$ kubectl get pods -o=custom-columns=node:.spec.nodeName  > data.py
```

Edit `data.py` to look like this:

```python
nodes = [
    'illinois.edge-net.io', 'ufl.edge-net.io', 'waynestate.edge-net.io', 'osf.edge-net.io', 'wv.edge-net.io', 'ucsd.edge-net.io', 'nysernet.edge-net.io', 'uh.edge-net.io', 'ohio.edge-net.io', 'indiana.edge-net.io', 'cenic.edge-net.io', 'toronto-core.edge-net.io', 'toronto.edge-net.io', 'louisiana.edge-net.io', 'iminds.edge-net.io', 'nps.edge-net.io', 'node-0', 'umich.edge-net.io', 'france.edge-net.io', 'clemson.edge-net.io', 'nyu.edge-net.io', 'northwestern.edge-net.io', 'hawaii.edge-net.io',
    ]
port = 8080
```

We can then use `data.py` with some reporting code.

```python
#!/usr/bin/python2.7
import urllib2
import sys
from data import nodes, port
import time

def get_response(node_tuple):
  try:
    query = node_tuple[0]
    return (query, node_tuple[1], urllib2.urlopen(query).read().rstrip())
  except urllib2.URLError:
    return (node_tuple[1], 'Error')


pairs = [(node, node.split('.')[0]) for node in nodes]


#
# build the queries
#
queries = [('http://%s:%d/hello?hostname=%s' % (pair[0], port, pair[1]), pair[0]) for pair in pairs]

#
# get the results and split into error and non-error
#

results = [get_response(query) for query in queries]
errors = [result for result in results if result[1] == 'Error']
results = [result for result in results if result[1] != 'Error']

#
# Print the unreachable nodes
#
if (len(errors) > 0): 
  print '| Unreachable |'
  print '|-------------|'
  for e in errors: print '|'  + e[0] + ' |'
if (len(results) > 0):
  # get   the times for each result, and set up records
  # for printing (node, greeting, time)
  final = []
  for r in results:
    start = time.time()
    get_response(r)
    end = time.time()
    final.append((r[1], r[2], (end - start) * 1000))
  #
  # print the results
  #
  
  print '| Node | Greeting | Time in ms |'
  print '|------|:--------:|-----------:|'
 
  for f in final:
    print '%s | %s | %d' % f

```

This will take awhile, and we may find that some nodes aren't as healthy
as we think.  Those are all the errors.  When the code runs, this is
what we see:


| Unreachable |
|-------------|
|toronto-core.edge-net.io |
|toronto.edge-net.io |
|node-0 |
|france.edge-net.io |
|clemson.edge-net.io |


| Node | Greeting | Time in ms |
|------|:--------:|-----------:|
illinois.edge-net.io | Hello, World, from illinois! | 134
ufl.edge-net.io | Hello, World, from ufl! | 156
waynestate.edge-net.io | Hello, World, from waynestate! | 147
osf.edge-net.io | Hello, World, from osf! | 17
wv.edge-net.io | Hello, World, from wv! | 153
ucsd.edge-net.io | Hello, World, from ucsd! | 35
nysernet.edge-net.io | Hello, World, from nysernet! | 160
uh.edge-net.io | Hello, World, from uh! | 127
ohio.edge-net.io | Hello, World, from ohio! | 148
indiana.edge-net.io | Hello, World, from indiana! | 134
cenic.edge-net.io | Hello, World, from cenic! | 29
louisiana.edge-net.io | Hello, World, from louisiana! | 117
iminds.edge-net.io | Hello, World, from iminds! | 491
nps.edge-net.io | Hello, World, from nps! | 34
umich.edge-net.io | Hello, World, from umich! | 189
nyu.edge-net.io | Hello, World, from nyu! | 188
northwestern.edge-net.io | Hello, World, from northwestern! | 147
hawaii.edge-net.io | Hello, World, from hawaii! | 132

## Be Sure to Clean Up!

When you're done, choose `Delete` from the right-hand menu in
ReplicaSets:

![Delete](assets/images/delete.png)


## Suggested Future Reading
Here are some starting points for you to further explore the
technologies used in this tutorial, and related technologies:
1. [Using EdgeNet](https://edge-net.org/using_EdgeNet.html)
2. [Docker Tutorial](https://docs.docker.com/get-started/)
3. [Hello, World in Kubernetes](https://kubernetes-v1-4.github.io/docs/hellonode/)
4. [Hello, Minikube](https://kubernetes.io/docs/tutorials/hello-minikube/);
  Minikube allows you to run Kubernetes on your local machine.

