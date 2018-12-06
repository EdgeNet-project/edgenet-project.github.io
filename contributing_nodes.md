---
---
# Contributing nodes to EdgeNet


Any site can contribute nodes to EdgeNet on a part-time or fulltime basis.  No approval from edge-net.org is required.  EdgeNet users should also note that EdgeNet hasn't vetted these nodes; they may be secure, or not, may be subject to memory dump attacks, etc.  *Unencrypted sensitive information should not be stored on an EdgeNet node*; EdgeNet is an experimental infrastructure and testbed built with contributed resources, _not_ a reliable, robust, secure facility.

Best practices for contributed nodes:

* _Only contribute nodes outside your institution's firewall!_  Best practice is in a Science DMZ.  When you are running EdgeNet, you're permitting experimenters from around the world to run programs on your University's systems.
* Contribute virtual machines rather than physical machines.  If you find an EdgeNet experiment misbehaving on a VM, it's easy to just blow the VM away
* A clean Ubuntu  18.04 or Centos 7 VM

Requirements for contributed nodes:

* A virtual or physical machine running a modern version of Ubuntu or Centos (we recommend Ubuntu 18.04 and Centos 7)
* Connectivity to a repo that is up-to-date
* A routable IP address

Adding a node is a simple matter of running a shell script.  As root on the VM, download the appropriate script for [Ubuntu] (https://sundewcluster.appspot.com/downloads/setup_node.sh)  at https://sundewcluster.appspot.com/downloads/setup_node.sh or [Centos] (https://sundewcluster.appspot.com/downloads/setup_centos.sh)  at https://sundewcluster.appspot.com/downloads/setup_centos.sh(link in plaintext for easy copy/paste)  and run it as root.  After about 30 seconds, you'll be prompted to add a name; choose any name that is a valid prefix of a fully-qualifed domain name.  If you've chosen a valid _name_ and it isn't otherwise taken, your node will be added at _name.edge-net.io_.  The whole process takes about a minute. 



**NOTE**: We have installation guides for some parts of the system
in our [Google docs](https://github.com/EdgeNet-project/notes/blob/master/googledocs.md).
Feel free to take a look as we update this page.
