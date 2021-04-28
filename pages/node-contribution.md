---
layout: "page"
title: "Contribute a Node"
nav_order: 2
---

# Contributing a node to EdgeNet

Anyone who wishes to do socan contribute a node to the EdgeNet project – it just takes five minutes – 
and thereby support the not-for-profit research that is conducted on the platform. 

A node is a machine, virtual or physical, that
hosts [kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/), the Kubernetes agent,
and [Docker](https://www.docker.com/), the container runtime.

Nodes can be contributed for any duration.
For example, it is possible to start a powerful node for the needs of an experiment and to stop it afterwards.


## Basic instructions

Run the following command and follow the on-screen instructions 
of the [Ansible](https://www.ansible.com/) playbook that it downloads:

```bash
bash -ci "$(wget -O - https://bootstrap.edge-net.org)"
```

If it is not already present on your system, you will need to install the [wget](https://www.gnu.org/software/wget/)
web file retrieval utility in order for the command to work.

The node must have a public IP address and, if it is behind a firewall,
you will need to configure it to allow incoming connections from at least the following protocols and ports:
`tcp:22,179,2379,5473,10250,25010,30000-32767`, `icmp` and `ipip`.

If you encounter a problem during setup, please email the script output and the public IP address of the
machine to <edgenet-support@planet-lab.eu>.


## From a machine on your premises

A node can be a VM on a machine that you control, or you can dedicate a physical machine to EdgeNet.
EdgeNet can be installed on a CentOS 8+, Fedora 32+, or Ubuntu 18.04+ operating system.
The machine should have at least 2 CPU cores, and 1 GiB of memory. 
EdgeNet does not yet support ARM processors or OpenVZ virtual machines.


## From a public cloud

You can easily run multiple EdgeNet instances in the cloud. You can choose the instance type you want, although we
recommend instances with at least 2 vCPUs and 1 GiB of memory. EdgeNet does not yet support ARM instances.

Simply create an instance of your liking using the cloud service provider's web interface, connect to it via SSH, 
and follow the basic instructions described above.
The default settings of the providers are usually correct for EdgeNet, but you need to ensure that
the protocols and ports described above are allowed for incoming connections.

Provider | Minimal instance recommended | Cost per month
---------|------------------------------|---------------
[Amazon EC2](https://console.aws.amazon.com/ec2/v2/home) | `t3.small` (2 vCPUs, 2 GiB of memory) | ~15$
[Google Cloud](https://console.cloud.google.com/compute/instances) | `e2-standard-2` (2 vCPUs, 8 GiB of memory) | ~48$
[Microsoft Azure](https://portal.azure.com) | `B2s` (2 vCPUS, 4 GiB of memory) | ~30$

### Special instructions for Google Cloud

On Google Cloud, the EdgeNet public SSH key must be added manually at the bottom of the instance creation page:

<img alt="Google Cloud - Set SSH Key" src="{{ site.baseurl }}/assets/images/gcp-ssh-key.png" width="400px"/>

The SSH key in Google Cloud format is:
```
edgenet:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDv+9LemKEmusyhq+4TCy4Uq9y+dj3uAEBLR5ZqYVw5fATWif15PRB+TvN2YCcBGJqbtmNokKIiUQq6i53CbzmCdBVsEFBlanDUqt4xHjnJI4vnYyjeltepC6TmFDqRq15KutS2dVF2XQ6uH3LGSHXBDlaguDSpEP5pa3DaiZqRdUpAItFXY0g4O80g3qmzj1lzkb/5briRyB4wOBgT+J4fnbSawXbAaXV49TQhjMDyDDVTRNCiUwAa1jaAkh17rK4aweVu0t+rkGv42gpIyJEvWHGxXeSqbegjFYljsKeI21s8yzAHyxHDT90053Pno4vyrfAXWWJR5JlGl1tNy3P9 edgenet
```

## From a public cloud with the command line
{: .d-inline-block }
Advanced
{: .label .label-purple }

These instructions are for advanced users who wish to automate the deployment of EdgeNet instances.

[expand]

### Amazon AWS

First, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
and, if not already done, connect your AWS account:

```bash
aws configure
```

We consider here a [`t3.small`](https://aws.amazon.com/ec2/instance-types/t3/) instance in
the [`us-east-1`](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions)
region. To use a different instance type and/or region, just replace those values in the commands below.

To keep things simple here, we allow all incoming connections towards the instance. You can restrict incoming
connections as you like, as long as you keep the protocols and ports listed above open.

```bash
aws ec2 create-security-group --region us-east-1 --group-name edgenet --description "EdgeNet"
aws ec2 authorize-security-group-ingress --region us-east-1 --group-name edgenet --cidr 0.0.0.0/0 --protocol all
```

To create the instance, run the following:

```bash
wget https://bootstrap.edgenet.org
aws ec2 run-instances \
  --region us-east-1 \
  --image-id ami-033558be0aac13adc \
  --instance-type t3.small \
  --security-groups edgenet \
  --user-data file://bootstrap.sh
```

Note that the Ubuntu `image-id` is different for each region, to find the ID for a given region, use
the [Amazon EC2 AMI Locator](http://cloud-images.ubuntu.com/locator/ec2/).

#### Cleanup

To delete the firewall rules and the instance, run the following, replacing the `instance-id`:

```bash
aws ec2 terminate-instances --region us-east-1 --instance-ids i-xxxx
# Wait for instance termination...
aws ec2 delete-security-group --region us-east-1 --group-name edgenet
```

#### Troubleshooting

If you encounter a problem, delete the instance and try again. If the problem persists you can SSH into the instance
using [EC2 Instance Connect](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-methods.html#ec2-instance-connect-connecting-console)
and send the logs of the startup script to <edgenet-support@planet-lab.eu>:

```bash
cat /var/log/cloud-init-output.log
```

### Google Cloud Platform

First, install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install), and, if not already done, connect your
Google account:

```bash
gcloud init
```

To keep things simple here, we allow all incoming connections towards the instances with the `edgenet` tag. You can
restrict incoming connections as you like, as long as you keep the protocols and ports listed above open.

```bash
gcloud compute firewall-rules create edgenet-ingress \
    --allow tcp,udp,icmp,ipip \
    --target-tags=edgenet
```

Finally, to create an instance named `edgenet-1`of
type [`e2-standard-2`](https://cloud.google.com/compute/vm-instance-pricing) in
the [`us-central1-a`](https://cloud.google.com/compute/docs/regions-zones/) region, run:

```bash
gcloud compute instances create edgenet-1 \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --machine-type=e2-standard-2 \
    --metadata startup-script-url='https://bootstrap.edge-net.org',ssh-keys='edgenet:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDv+9LemKEmusyhq+4TCy4Uq9y+dj3uAEBLR5ZqYVw5fATWif15PRB+TvN2YCcBGJqbtmNokKIiUQq6i53CbzmCdBVsEFBlanDUqt4xHjnJI4vnYyjeltepC6TmFDqRq15KutS2dVF2XQ6uH3LGSHXBDlaguDSpEP5pa3DaiZqRdUpAItFXY0g4O80g3qmzj1lzkb/5briRyB4wOBgT+J4fnbSawXbAaXV49TQhjMDyDDVTRNCiUwAa1jaAkh17rK4aweVu0t+rkGv42gpIyJEvWHGxXeSqbegjFYljsKeI21s8yzAHyxHDT90053Pno4vyrfAXWWJR5JlGl1tNy3P9 edgenet' \
    --no-scopes \
    --no-service-account \
    --tags=edgenet \
    --zone us-central1-a
```

#### Cleanup

To delete the firewall rules and the instance, run the following:

```bash
gcloud compute firewall-rules delete edgenet-ingress
gcloud compute instances delete edgenet-1 --zone us-central1-a
```

#### Troubleshooting

If you encounter a problem, delete the instance and try again. If the problem persists you can SSH into the instance and
send the logs of the startup script to <edgenet-support@planet-lab.eu>:

```bash
gcloud compute ssh edgenet-test-1 --zone us-central1-a
sudo journalctl -u google-startup-scripts.service
```

### Microsoft Azure

First, install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and if not already done,
connect your Microsoft account:

```bash
az login
```

Coming soon
{: .label .label-yellow }

[/expand]

## Technical details

See the [EdgeNet-Project/node](https://github.com/EdgeNet-project/node/) repository for more information.
