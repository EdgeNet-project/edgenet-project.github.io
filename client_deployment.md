---
---
# Tutorial: Deploying a Client on EdgeNet 
One of the principal sources of value of EdgeNet for its experimenters is that
it provides nodes that are
scattered across the internet, offering both topological and geographic
diversity for experiments in network measurements and distributed systems.
In such experiments, clients are first rate components, which differs from
typical Kubernetes deployments that are centered on servers.
The instructions that guide a client
might not all be known in advance of an experiment, or they might need to be issued in a
coordinated manner across mulitple nodes over the course of an experiment. In either
case, remote piloting could be called for, which differs from the more
"set and forget" approach taken when running a server. This tutorial
thus focuses on how to launch and control a client on EdgeNet.

## What You Will Do and What You Will Learn 
This tutorial steps you through the creation and deployment of a client on
EdgeNet, which you then control in each of three ways:
* via remote login
* via remote execution
* via a predefined set of instructions

In this tutorial, you will create a Kubernetes pod that consists of a
simple CentOS container. Into your container, you will install a network
measurement tool called `paris-traceroute` tool, which allows you see
the multiple load-balanced
paths taken on a route from your container to a destination address. You
will prepare an image that contains this tool and that you will deploy
across EdgeNet. You will then pilot the tool in each of the ways mentioned
above.

Following this tutorial, you will have the skills necessary to create
a Linux container, install the client software that you like via a package
manager, and save the container as a Docker image for later deployment.
You will be able to deploy that image and control the client in a variety
of ways.

## Technologies That You Will Use
The technologies that you will use are:

* [Docker](https://www.docker.com/), to create your container
* [curl](https://curl.haxx.se/), to download client software
* [RPM](https://rpm.org/), to install the client software 
* [paris-traceroute](https://paris-traceroute.net/), the client software
* [Kubernetes](https://kubernetes.io/), to deploy your containers to the EdgeNet nodes

## Prepare
Create accounts:
1. [EdgeNet](http://edge-net.org/), following the instructions in [Using EdgeNet](https://edge-net.org/using_EdgeNet.html),
  and making a note of your namespace
2. [Docker Hub](https://hub.docker.com/), a convenient place from which
  to pull Docker images onto your services

Install software:
1. [Docker](https://www.docker.com/), to launch Docker operations from
  the command line
2. [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  to control a Kubernetes cluster from the command line

Download and test:
1. Download your configuration file from the portal, as per the instructions in
  [Using EdgeNet](https://edge-net.org/using_EdgeNet.html),
  saving it as `$HOME/.kube/config`. If you do not
  already have a `.kube` directory, create one now in order to house
  the configuration file.
2. Run `$ kubectl get nodes` to see the nodes.

You should see a set of EdgeNet nodes, similar to the list below. If you see something
much different, you are not connected to the right cluster.
```
$ kubectl get nodes
NAME                       STATUS                        ROLES     AGE       VERSION
carleton.edge-net.io       Ready                         <none>    88d       v1.10.3
cenic.edge-net.io          Ready                         <none>    88d       v1.10.3
clemson.edge-net.io        Ready                         <none>    80d       v1.10.3
cornell.edge-net.io        Ready                         <none>    7d        v1.10.5
gpo.edge-net.io            Ready                         <none>    80d       v1.10.3
hawaii.edge-net.io         Ready                         <none>    88d       v1.10.3
illinois.edge-net.io       Ready                         <none>    88d       v1.10.3
iminds.edge-net.io         Ready                         <none>    88d       v1.10.3
indiana.edge-net.io        Ready                         <none>    67d       v1.10.4
kansas.edge-net.io         Ready                         <none>    67d       v1.10.4
louisiana.edge-net.io      Ready                         <none>    64d       v1.10.4
missouri.edge-net.io       Ready                         <none>    88d       v1.10.3
node-0                     NotReady,SchedulingDisabled   <none>    41d       v1.10.5
northwestern.edge-net.io   Ready                         <none>    88d       v1.10.3
nps.edge-net.io            Ready                         <none>    64d       v1.10.4
nysernet.edge-net.io       Ready                         <none>    64d       v1.10.4
nyu.edge-net.io            Ready                         <none>    64d       v1.10.4
ohio.edge-net.io           Ready                         <none>    64d       v1.10.4
sundew-project             Ready                         master    97d       v1.10.2
tennessee.edge-net.io      Ready                         <none>    64d       v1.10.4
toronto-core.edge-net.io   Ready                         <none>    88d       v1.10.3
toronto.edge-net.io        Ready                         <none>    88d       v1.10.3
ucla.edge-net.io           Ready                         <none>    88d       v1.10.3
ucsd.edge-net.io           Ready                         <none>    88d       v1.10.3
umich.edge-net.io          Ready                         <none>    88d       v1.10.3
utdallas.edge-net.io       Ready                         <none>    88d       v1.10.3
washington.edge-net.io     Ready                         <none>    88d       v1.10.3
waterloo.edge-net.io       Ready                         <none>    88d       v1.10.3
$
```

## Create Your Container
Steps:
1. Start Docker on your computer.
2. Log in to Docker Hub, if starting Docker did not already log you in.
3. At the command line, create a CentOS container with `docker create centos`.

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

You should now be able to see the image amongst your Docker images by invoking `docker images`,
giving you a listing like the following:

```
$ docker images
REPOSITORY                         TAG                 IMAGE ID            CREATED             SIZE
centos                             latest              5182e96772bf        13 days ago         200MB
perfsonar/testpoint                latest              ca3e8e2af3db        2 months ago        919MB
node                               4.4                 93b396996a16        2 years ago         648MB
$
```

## Run Your Container Locally
Steps:
1. At the command line, run the CentOS image with a Bash shell: `docker run -dit centos`.
2. Verify that it is running and obtain its container ID by examining the output of `docker ps`.
3. Connect to the Bash shell on your container with `docker attach <container ID>`,
  substituting the container ID for `<container ID>`.
4. From within that shell, check the OS version of your container with `cat /etc/system-release`.
5. Detach from the Bash shell, and the container as a whole, while maintaining a live
  container, with Ctrl-p Ctrl-q.

You should see something like this (with the Ctrl-p Ctrl-q keystrokes not being visible):
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

The command line options for `docker run` are: 
* `-d` starts the image in "detached mode". If you were to run the container without this option, you would be logged into it directly.
* `-t` and `-i` together allocate a tty as the primary process and keep STDIN open. By default in this case, the tty provides a Bash shell.

With Docker, if a container's primary process ever stops, the container stops as well. If you were to run the CentOS image without a primary process, say via `docker run -d centos`, it would stop right away. Similarly, if you were to detach from the container with an `exit` command instead of Ctrl-p Ctrl-q, the container would stop.

## Install the Client Software
As you complete this section, you will want to be careful not to kill your running container,
so as not to lose your work before proceeding to the next section:
be sure, as described in the last step of this section, to detach from the container with Ctrl-p Ctrl-q.

Steps:
1. If not already logged in to the container, do so now with `docker attach <container ID>`,
  using the container ID that you see in `docker ps` output.
2. From the command line in the container, download the client software packages.
  Your client tool will be the `paris-traceroute`, provided by the package of the same name, and which
  depends upon the `libparistraceroute` package:
   * `curl -Ok https://paris-traceroute.net/downloads/packages/Fedora/20/libparistraceroute-0.9-1.fc20.x86_64.rpm`
   * `curl -Ok https://paris-traceroute.net/downloads/packages/Fedora/20/paris-traceroute-0.9-1.fc20.x86_64.rpm`
3. Install these packages:
   * `rpm -iv libparistraceroute-0.9-1.fc20.x86_64.rpm`
   * `rpm -iv paris-traceroute-0.9-1.fc20.x86_64.rpm`
4. Clean up:
   * `rm libparistraceroute-0.9-1.fc20.x86_64.rpm`
   * `rm paris-traceroute-0.9-1.fc20.x86_64.rpm`
5. Try out the client tool with a command like `paris-traceroute -amda <target name>`,
  tracing towards an EdgeNet node, for instance.
6. Detach from the container using Ctrl-p Ctrl-q.


The command line options for `curl` are:
* `-O` (a capital letter O) to write the output to a file
* `-k` to allow a connection to a website that doesn't have a valid certificate

The command line options for `rpm` are:
* `-i` to install a package
* `-v` for verbose output

The command line option for `paris-traceroute` is:
* `-amda` to invoke the Mutipath Detection Algorithm (MDA)

Your installation of `paris-traceroute` should look something like this:
```
[root@8922cd313f37 /]# curl -Ok https://paris-traceroute.net/downloads/packages/Fedora/20/libparistraceroute-0.9-1.fc20.x86_64.rpm
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  108k  100  108k    0     0  98071      0  0:00:01  0:00:01 --:--:-- 98117
[root@8922cd313f37 /]# rpm -iv libparistraceroute-0.9-1.fc20.x86_64.rpm
Preparing packages...
libparistraceroute-0.9-1.fc20.x86_64
[root@8922cd313f37 /]# rm libparistraceroute-0.9-1.fc20.x86_64.rpm
rm: remove regular file 'libparistraceroute-0.9-1.fc20.x86_64.rpm'? y
[root@8922cd313f37 /]# curl -Ok https://paris-traceroute.net/downloads/packages/Fedora/20/paris-traceroute-0.9-1.fc20.x86_64.rpm
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 10928  100 10928    0     0   7748      0  0:00:01  0:00:01 --:--:--  7750
[root@8922cd313f37 /]# rpm -iv paris-traceroute-0.9-1.fc20.x86_64.rpm
Preparing packages...
paris-traceroute-0.9-1.fc20.x86_64
[root@8922cd313f37 /]# rm paris-traceroute-0.9-1.fc20.x86_64.rpm
rm: remove regular file 'paris-traceroute-0.9-1.fc20.x86_64.rpm'? y
[root@8922cd313f37 /]#
```

Because multipath route trace output can be lengthy, we reproduce the run of `paris-traceroute`
[at the end of this tutorial](#sample-client-output).


## Create A Client Image

To recapitulate, you have downloaded a vanilla CentOS image from Docker Hub,
run it as a container, and installed client software on it. Now, you can save
your updated container as a new image.

Steps:
1. Create a new image from the present one with `docker commit -m "installed paris-traceroute" <container ID>`,
  using the container ID that you have previously seen in the output of `docker ps`.
2. Find the ID of the new image in the ouput of `docker images`.
3. Tag the new image with a name that will be easy to remember, such as edgenet-client with `docker tag <image ID> edgenet-client`. You will see the new name in `docker images` if you invoke this command again.
4. Run the new image with `docker run -dit edgenet-client`.
5. Find the container ID of the new container in the output of `docker ps`.
6. Attach to the new container with `docker attach <container ID> `.
7. Try out the tool in the new container with a command like `paris-traceroute -amda <target name>`,
  tracing towards an EdgeNet node, for instance. 
8. Detach from the container using Ctrl-p Ctrl-q.

**TBD: show output**

## Automate Client Image Creation With a Dockerfile

This section is optional. It describes how to automate what you have just done
by using a Dockerfile instead of proceeding manually through each of the steps.

**TBD: write section**

## Remote Client Execution

You do not need to be logged in to an interactive shell in order to invoke the client tool
in the container. You can invoke the tool remotely via `docker exec`.

Steps:
1. Invoke the tool in the new container with a command like
  `docker exec <container ID> paris-traceroute -amda <target name>`,
  using the container ID that you have previously seen in the output of `docker ps`,
  with, as a target name, the name of an EdgeNet node, for instance.
  
It might take some time before you see any output at the command line, as the client
tool must complete its work before you see its output.

**TBD: show output**

## Push the Client Image to Docker Hub

**TBD: write section**

## Deploy the Client Image on EdgeNet

**TBD: write section**

## Sample Client Output

Below is an example run of `paris-traceroute` using the Multipath Detection Algorithm (MDA).
We have chosen EdgeNet node `toronto.edge-net.io` as a target.
The output shows multiple load-balanced interfaces at hops 7 (three interfaces), 8 (three interfaces), and 9 (four interfaces). Your results will surely differ.
```
Below is an example run of `paris-traceroute` using the Multipath Detection Algorithm (MDA).
[root@8922cd313f37 /]# paris-traceroute -amda toronto.edge-net.io
mda to toronto.edge-net.io (142.150.208.141), 30 hops max, 30 bytes packets
0 None -> 172.17.0.1 [{ 0*1, 0*2, 0*3, 0*4, 0*5, 0*6, 0!7, 0!8 } -> {  1*1, 1*2, 1*3, 1*4, 1*5, 1*6, 1*9, 1*10 }]
1 172.17.0.1 (gateway) -> 192.168.1.1 [{ 1*1, 1*2, 1*3, 1*4, 1*5, 1*6, 1*9, 1!10 } -> {  2*1, 2*3, 2*2, 2*4, 2*5, 2*6, 2*9, 2*11 }]
2 192.168.1.1 -> None [{ 2!1, 2!3, 2!2, 2!4, 2!5, 2!6, 2!9, 2!11 } -> {  3*12, 3*13, 3*14, 3*15, 3*16, 3*17, 3*18, 3*19 }]
3 None -> 24.164.160.40 [{ 3*12, 3*13, 3*14, 3*15, 3*16, 3*17, 3*18, 3*19 } -> {  4*12, 4*13, 4*14, 4*15, 4*16, 4*17, 4*18, 4*19 }]
4 24.164.160.40 (agg63.ulpkny0101h.nyc.rr.com) -> 24.164.165.126 [{ 4*12, 4*13, 4*14, 4*15, 4*16, 4*17, 4*18, 4*19 } -> {  5*12, 5*13, 5*14, 5*16, 5*15, 5*17, 5*18, 5*19 }]
5 24.164.165.126 (agg27.nwbrnycx01r.nyc.rr.com) -> 24.164.164.252 [{ 5*12, 5*13, 5*14, 5*16, 5*15, 5*17, 5*18, 5*19 } -> {  6*12, 6*14, 6*13, 6*15, 6*19, 6*16, 6*18, 6*17 }]
6 24.164.164.252 (agg64.nyclnyrg01r.nyc.rr.com) -> 66.109.6.78 [{ 6*12, 6*14, 6*13, 6*15, 6*19, 6*16, 6*18, 6*17, 6*20, 6*21, 6*22, 6*23, 6*24, 6*25, 6*26 } -> {  7*15, 7*13, 7*18, 7*14, 7*19, 7*17, 7*21, 7*25 }]
7 66.109.6.78 (bu-ether19.nwrknjmd67w-bcr00.tbone.rr.com) -> 66.109.6.27 [{ 7*15, 7*13, 7*18, 7*14, 7*19, 7*17, 7*21, 7*25, 7?28, 7?29, 7?30, 7?31, 7?32, 7?33, 7?34 } -> {  8 13, 8 15, 8 19, 8 23, 8 25, 8 16, 8 12, 8 21 }]
7 66.109.6.78 (bu-ether19.nwrknjmd67w-bcr00.tbone.rr.com) -> 66.109.5.138 [{ 7*15, 7*13, 7*18, 7*14, 7*19, 7*17, 7*21, 7*25, 7*29, 7*38, 7*30, 7*35, 7*28, 7*31, 7*36 } -> {  8*14, 8*18, 8*17, 8*22, 8*20, 8*33, 8*37, 8*39, 8 35, 8 36, 8 38, 8 32, 8 30 }]
7 107.14.19.24 (bu-ether29.nwrknjmd67w-bcr00.tbone.rr.com) -> 66.109.6.27 [{ 7*12, 7*16, 7*20, 7*22, 7*26, 7*24, 7*23, 7*27, 7*33, 7*39, 7*40, 7*41, 7*32, 7*37, 7*34, 7 42, 7 43 } -> {  8*13, 8*15, 8*19, 8*23, 8*25, 8*16, 8*12, 8*21, 8 24, 8 26, 8 27, 8 29, 8 31, 8 34, 8 41, 8 28, 8 40 }]
8 66.109.6.27 (bu-ether12.nycmny837aw-bcr00.tbone.rr.com) -> 66.109.1.57 [{ 8*13, 8*15, 8*19, 8*23, 8*25, 8*16, 8*12, 8*21, 8*24, 8*26, 8*27, 8*29, 8*31, 8*34, 8*41, 8*28, 8*40, 8?45, 8?46, 8?47, 8?48, 8?49, 8?50, 8?51, 8?52, 8?53, 8?54, 8?70 } -> {  9 23, 9 25, 9 37, 9 24, 9 22, 9 41, 9 28, 9 40 }]
8 66.109.6.27 (bu-ether12.nycmny837aw-bcr00.tbone.rr.com) -> 107.14.17.216 [{ 8*13, 8*15, 8*19, 8*23, 8*25, 8*16, 8*12, 8*21, 8*24, 8*26, 8*27, 8*29, 8*31, 8*34, 8*41, 8*28, 8*40, 8*45, 8*47, 8*52, 8*51, 8*59, 8*65, 8*58, 8*55, 8*62, 8*68, 8*61, 8 57, 8 64, 8 75, 8 72 } -> {  9*12, 9*14, 9*31, 9*16, 9*17, 9*39, 9*38, 9*66, 9 58, 9 67, 9 61, 9 45 }]
8 66.109.5.138 -> 66.109.1.57 [{ 8*14, 8*18, 8*17, 8*22, 8*20, 8*33, 8*37, 8*39, 8*35, 8*36, 8*38, 8*32, 8*30, 8*44, 8*46, 8*50, 8*53, 8*66, 8*54, 8*63, 8*67, 8*48, 8*49, 8*69, 8*60, 8*56, 8*70, 8*73, 8 71, 8 76, 8 74 } -> {  9*23, 9*25, 9*37, 9*24, 9*22, 9*41, 9*28, 9*40, 9 36, 9 65, 9 52, 9 63, 9 46, 9 59, 9 60, 9 62, 9 48, 9 73 }]
9 66.109.1.59 -> 209.51.175.37 [{ 9*15, 9*21, 9*20, 9*27, 9*33, 9*34, 9*30, 9*53, 9 47, 9 44, 9 55, 9 69, 9 56 } -> {  10*15, 10*27, 10*53, 10*19, 10*21, 10*20, 10*29, 10*34, 10 50, 10 32, 10 30, 10 37, 10 13, 10 26, 10 35, 10 25, 10 33, 10 23 }]
9 107.14.17.218 (0.ae1.pr1.nyc20.tbone.rr.com) -> 209.51.175.37 [{ 9*19, 9*13, 9*29, 9*26, 9*18, 9*35, 9*32, 9*50, 9 54, 9 51, 9 68, 9 49, 9 70 } -> {  10*15, 10*27, 10*53, 10*19, 10*21, 10*20, 10*29, 10*34, 10 50, 10 32, 10 30, 10 37, 10 13, 10 26, 10 35, 10 25, 10 33, 10 23, 10 18, 10 24 }]
9 66.109.1.57 (ge-1-3-0.a1.buf00.tbone.rr.com) -> 209.51.175.37 [{ 9*23, 9*25, 9*37, 9*24, 9*22, 9*41, 9*28, 9*40, 9 36, 9 65, 9 52, 9 63, 9 46, 9 59, 9 60, 9 62, 9 48, 9 73 } -> {  10*15, 10*27, 10*53, 10*19, 10*21, 10*20, 10*29, 10*34, 10 50, 10 32, 10 30, 10 37, 10 13, 10 26, 10 35, 10 25, 10 33, 10 23, 10 18, 10 24, 10 41, 10 40, 10 22, 10 14, 10 12, 10 28 }]
9 107.14.17.216 (0.ae0.pr1.nyc20.tbone.rr.com) -> 209.51.175.37 [{ 9*12, 9*14, 9*31, 9*16, 9*17, 9*39, 9*38, 9*66, 9 58, 9 67, 9 61, 9 45 } -> {  10*15, 10*27, 10*53, 10*19, 10*21, 10*20, 10*29, 10*34, 10 50, 10 32, 10 30, 10 37, 10 13, 10 26, 10 35, 10 25, 10 33, 10 23, 10 18, 10 24, 10 41, 10 40, 10 22, 10 14, 10 12, 10 28, 10 31, 10 17, 10 38, 10 16, 10 39, 10 66 }]
10 209.51.175.37 (v1101.core1.nyc4.he.net) -> 184.105.80.10 [{ 10*15, 10*27, 10*53, 10*19, 10*21, 10*20, 10*29, 10*34, 10 50, 10 32, 10 30, 10 37, 10 13, 10 26, 10 35, 10 25, 10 33, 10 23, 10 18, 10 24, 10 41, 10 40, 10 22, 10 14, 10 12, 10 28, 10 31, 10 17, 10 38, 10 16, 10 39, 10 66 } -> {  11*53, 11*15, 11*27, 11*19, 11*29, 11*21, 11*20, 11*34 }]
11 184.105.80.10 (100ge14-1.core1.tor1.he.net) -> 216.66.30.114 [{ 11*53, 11*15, 11*27, 11*19, 11*29, 11*21, 11*20, 11*34 } -> {  12*53, 12*19, 12*27, 12*15, 12*29, 12*21, 12*20, 12*34 }]
12 216.66.30.114 (gtanet-networking.10gigabitethernet3-1.core1.tor1.he.net) -> 205.211.94.134 [{ 12*53, 12*19, 12*27, 12*15, 12*29, 12*21, 12*20, 12*34 } -> {  13*53, 13*19, 13*27, 13*29, 13*15, 13*20, 13*21, 13*34 }]
13 205.211.94.134 (utoronto2-ut-hub-if-internet.gtanet.ca) -> 128.100.96.3 [{ 13*53, 13*19, 13*27, 13*29, 13*15, 13*20, 13*21, 13*34 } -> {  14*53, 14*27, 14*29, 14*19, 14*34, 14*21, 14*15, 14*20 }]
14 128.100.96.3 (bcit-gpb.gw.utoronto.ca) -> 142.150.208.141 [{ 14*53, 14*27, 14*29, 14*19, 14*34, 14!21, 14*15, 14!20 } -> {  15 27, 15 53, 15 15, 15 19, 15 29, 15 34 }]
Lattice:
None -> [ 172.17.0.1 ]
172.17.0.1 -> [ 192.168.1.1 ]
192.168.1.1 -> [ None ]
None -> [ 24.164.160.40 ]
24.164.160.40 -> [ 24.164.165.126 ]
24.164.165.126 -> [ 24.164.164.252 ]
24.164.164.252 -> [ 66.109.6.78, 107.14.19.24 ]
66.109.6.78 -> [ 66.109.6.27, 66.109.5.138 ]
66.109.6.27 -> [ 66.109.1.59, 107.14.17.218, 66.109.1.57, 107.14.17.216 ]
66.109.1.59 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.218 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
66.109.1.57 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.216 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
66.109.5.138 -> [ 66.109.1.57, 107.14.17.216, 66.109.1.59, 107.14.17.218 ]
66.109.1.57 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.216 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
66.109.1.59 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.218 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.19.24 -> [ 66.109.5.138, 66.109.6.27 ]
66.109.5.138 -> [ 66.109.1.57, 107.14.17.216, 66.109.1.59, 107.14.17.218 ]
66.109.1.57 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.216 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
66.109.1.59 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.218 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
66.109.6.27 -> [ 66.109.1.59, 107.14.17.218, 66.109.1.57, 107.14.17.216 ]
66.109.1.59 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.218 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
66.109.1.57 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141
107.14.17.216 -> [ 209.51.175.37 ]
209.51.175.37 -> [ 184.105.80.10 ]
184.105.80.10 -> [ 216.66.30.114 ]
216.66.30.114 -> [ 205.211.94.134 ]
205.211.94.134 -> [ 128.100.96.3 ]
128.100.96.3 -> [ 142.150.208.141 ]
142.150.208.141

[root@8922cd313f37 /]#
```

