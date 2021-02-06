---
layout: page
title: Contributing a Node
nav_order: 2
---

# Contributing a node to EdgeNet

Anyone can contribute a node to the EdgeNet project.
A node is a machine, virtual or physical, that hosts [kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/), the Kubernetes agent, and [Docker](https://www.docker.com/), the container runtime.
Nodes can be contributed for any duration.
For example, it is possible to start a powerful node for the need of an experiment, and to stop it after.

The easiest way to start a node is by using one of our pre-built image for the major public cloud provider.
If you already have a dedicated machine, on-premise or in the cloud, you can use our bootstrap script to deploy a node.

## From a public cloud

We provide pre-built EdgeNet node images for multiple cloud providers.
You can choose the instance type you want, although we recommend instances with at-least 2 vCPUs and 1 GiB of memory.
ARM instances are not currently supported.

### Amazon AWS

The EdgeNet node AMI (Amazon Machine Image) identifier is `ami-04fe1e49f9fd33bac`.  
We recommend a `t3.small` (2 vCPUs, 1 GiB of memory, ~16 USD/month) or larger instance.  
See [Amazon EC2 On-Demand Pricing](https://aws.amazon.com/ec2/pricing/on-demand/) for the prices of the different instance types.

#### From the CLI

You can create a node from the command line, by installing the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and running:
```bash
aws ec2 run-instances --image-id ami-04fe1e49f9fd33bac --instance-type t3.small
```

#### From your browser

You can use the [EC2 Management Console](https://console.aws.amazon.com/ec2/v2/home) from your web browser.

### Google Cloud Platform

We recommend a `n1-standard-2` (2 vCPUs, 8GiB of memory, ~50 USD/month) or larger instance.
See [VM instances pricing](https://cloud.google.com/compute/vm-instance-pricing) for the prices of the different instance types.

#### From the CLI

Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and run:
```bash
gcloud compute instances create ...
```

### Microsoft Azure

We recommend a `B2S` (2 vCPUs, 4GiB of memory, ~45 USD/month) or larger instance.
See [Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) for the prices of the different instance types.

#### From the CLI

Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and run:
```bash
az vm create ...
```

## From a dedicated machine

The machine must have a public IP address, and at-least 2 CPU cores and 1GiB of memory.
The supported operating systems are CentOS 8+, Fedora 32+ and Ubuntu 18.04+
Currently, OpenVZ virtual machines as well as ARM processors are not supported.

On a dedicated or virtual machine with [wget](https://www.gnu.org/software/wget/) installed, run the following command and follow the on-screen instructions:
```bash
bash -c "$(wget -O - https://edge-net.org/bootstrap.sh)"
```

## Technical details

We use [Ansible](https://www.ansible.com/) and [Packer](https://www.packer.io/) to deploy nodes.
See the [EdgeNet-Project/node](https://github.com/EdgeNet-project/node/) repository for more information.