---
layout: page
title: Contribute a Node
nav_order: 2
---

# Contributing a node to EdgeNet

Anyone can contribute a node to the EdgeNet project.
A node is a machine, virtual or physical, that hosts [kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/), the Kubernetes agent, and [Docker](https://www.docker.com/), the container runtime.
Nodes can be contributed for any duration.
For example, it is possible to start a powerful node for the need of an experiment, and to stop it after.

## From a dedicated machine

The machine must have a public IP address, and at-least 2 CPU cores and 1GiB of memory.
The supported operating systems are CentOS 8+, Fedora 32+ and Ubuntu 18.04+
Currently, OpenVZ virtual machines as well as ARM processors are not supported.

On a physical or virtual machine with [wget](https://www.gnu.org/software/wget/) installed, run the following command and follow the on-screen instructions:
```bash
bash -c "$(wget -O - https://bootstrap.edge-net.org)"
```

If you have a firewall in front of the machine, at-least the following ports and protocols must be allowed:
`tcp:179,tcp:2379,tcp:5473,tcp:10250,tcp:25010,tcp:30000-32767,ipip,icmp`.

## From a public cloud

You can easily run multiple EdgeNet instances in the cloud.
You can choose the instance type you want, although we recommend instances with at-least 2 vCPUs and 1 GiB of memory.
ARM instances are not currently supported.

### Amazon AWS

The EdgeNet node AMI (Amazon Machine Image) identifier is `ami-04fe1e49f9fd33bac`.  
We recommend a `t3.small` (2 vCPUs, 1 GiB of memory, ~16 USD/month) or larger instance.  
See [Amazon EC2 On-Demand Pricing](https://aws.amazon.com/ec2/pricing/on-demand/) for the prices of the different instance types.

#### From the CLI

First, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
and, if not already done, connect your AWS account:
```bash
aws configure
```

Then, run the following commands to allow the Kubernetes ports:
```bash
aws ec2 create-security-group --group-name edgenet --description "EdgeNet"
aws ec2 authorize-security-group-ingress --group-name edgenet --cidr 0.0.0.0/0 --protocol tcp --port 179
aws ec2 authorize-security-group-ingress --group-name edgenet --cidr 0.0.0.0/0 --protocol tcp --port 2379
aws ec2 authorize-security-group-ingress --group-name edgenet --cidr 0.0.0.0/0 --protocol tcp --port 5473
aws ec2 authorize-security-group-ingress --group-name edgenet --cidr 0.0.0.0/0 --protocol tcp --port 10250
aws ec2 authorize-security-group-ingress --group-name edgenet --cidr 0.0.0.0/0 --protocol tcp --port 25010
aws ec2 authorize-security-group-ingress --group-name edgenet --cidr 0.0.0.0/0 --protocol tcp --port 30000-32767
# TODO: IP-in-IP, ICMP
```

```bash
aws ec2 run-instances --image-id ami-04fe1e49f9fd33bac --instance-type t3.small
```

#### From your browser

You can use the [EC2 Management Console](https://console.aws.amazon.com/ec2/v2/home) from your web browser.

### Google Cloud Platform

We recommend a `e2-standard-2` (2 vCPUs, 8GiB of memory, ~50 USD/month) or larger instance.
See [VM instances pricing](https://cloud.google.com/compute/vm-instance-pricing) for the prices of the different instance types.

#### From the CLI

First, install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install), and, if not already done, connect your Google account:
```bash
gcloud init
```

Then, run the following command to allow the Kubernetes ports to all instances with the `edgenet` tag:
```bash
gcloud compute firewall-rules create edgenet-ingress \
    --allow tcp:179,tcp:2379,tcp:5473,tcp:10250,tcp:25010,tcp:30000-32767,ipip,icmp \
    --target-tags=edgenet
```

Finally, to create an instance named `edgenet-1`of type [`e2-standard-2`](https://cloud.google.com/compute/vm-instance-pricing) in the [`us-central1-a`](https://cloud.google.com/compute/docs/regions-zones/) region, run:
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

To delete the firewall rules and the instance, run the following:
```bash
gcloud compute firewall-rules delete edgenet-ingress
gcloud compute instances delete edgenet-1 --zone us-central1-a
```

##### Troubleshooting

If you encounter a problem, delete the instance and try again.
If the problem persists you can SSH into the instance and send us the logs of the startup script:
```bash
gcloud compute ssh edgenet-test-1 --zone us-central1-a
sudo journalctl -u google-startup-scripts.service
```

### Microsoft Azure

We recommend a `B2S` (2 vCPUs, 4GiB of memory, ~45 USD/month) or larger instance.
See [Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) for the prices of the different instance types.

#### From the CLI

Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and run:
```bash
az vm create ...
```


## Technical details

We use [Ansible](https://www.ansible.com/) to deploy nodes.
See the [EdgeNet-Project/node](https://github.com/EdgeNet-project/node/) repository for more information.
