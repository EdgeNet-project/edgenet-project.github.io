---
layout: "page"
title: "Contribute a Node"
nav_order: 2
---

# Contributing a node to EdgeNet

Anyone can contribute a node to the EdgeNet project. A node is a machine, virtual or physical, that
hosts [kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/), the Kubernetes agent,
and [Docker](https://www.docker.com/), the container runtime. Nodes can be contributed for any duration. For example, it
is possible to start a powerful node for the need of an experiment, and to stop it after.

## From a dedicated machine

The machine must have a public IP address, and at-least 2 CPU cores and 1 GiB of memory. The supported operating systems
are CentOS 8+, Fedora 32+ and Ubuntu 18.04+ Currently, OpenVZ virtual machines as well as ARM processors are not
supported.

On a physical or virtual machine with [wget](https://www.gnu.org/software/wget/) installed, run the following command
and follow the on-screen instructions:

```bash
bash -ci "$(wget -O - https://bootstrap.edge-net.org)"
```

If you have a firewall in front of the machine, at-least the following ports and protocols must be allowed:
`tcp:22,179,2379,5473,10250,25010,30000-32767`, `icmp` and `ipip`.

## From a public cloud

You can easily run multiple EdgeNet instances in the cloud. You can choose the instance type you want, although we
recommend instances with at-least 2 vCPUs and 1 GiB of memory. ARM instances are not currently supported.

Below we give the instructions to create instances from the CLI, for automation purpose or for use in scripts. It's also
possible to create instances using the web interface of each cloud providers and simply run the bootstrap script as
above.

### Amazon AWS

We recommend a `t3.small` (2 vCPUs, 1 GiB of memory, ~16 USD/month) or larger instance.  
See [Amazon EC2 On-Demand Pricing](https://aws.amazon.com/ec2/pricing/on-demand/) for the prices of the different
instance types.

#### From the CLI

First, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
and, if not already done, connect your AWS account:

```bash
aws configure
```

We consider here a [`t3.small`](https://aws.amazon.com/ec2/instance-types/t3/) instance
the [`us-east-1`](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions)
region. To use a different instance type and/or region, simply replace those values in the commands below.

To keep things simple here, we allow all incoming connections towards the instance. You can restrict incoming
connections as you like, as long as you keep the ports listed above open.

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

Note that the Ubuntu `image-id` is different for each region, to find the id for a given region, use
the [Amazon EC2 AMI Locator](http://cloud-images.ubuntu.com/locator/ec2/).

##### Cleanup

To delete the firewall rules and the instance, run the following by replacing the `instance-id`:

```bash
aws ec2 terminate-instances --region us-east-1 --instance-ids i-xxxx
# Wait for instance termination...
aws ec2 delete-security-group --region us-east-1 --group-name edgenet
```

##### Troubleshooting

If you encounter a problem, delete the instance and try again. If the problem persists you can SSH into the instance
using [EC2 Instance Connect](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-methods.html#ec2-instance-connect-connecting-console)
and send us the logs of the startup script:

```bash
cat /var/log/cloud-init-output.log
```

#### From your browser

You can use the [EC2 Management Console](https://console.aws.amazon.com/ec2/v2/home) from your web browser.

### Google Cloud Platform

We recommend a `e2-standard-2` (2 vCPUs, 8 GiB of memory, ~50 USD/month) or larger instance.
See [VM instances pricing](https://cloud.google.com/compute/vm-instance-pricing) for the prices of the different
instance types.

#### From the CLI

First, install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install), and, if not already done, connect your
Google account:

```bash
gcloud init
```

To keep things simple here, we allow all incoming connections towards the instances with the `edgenet` tag. You can
restrict incoming connections as you like, as long as you keep the ports listed above open.

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

##### Cleanup

To delete the firewall rules and the instance, run the following:

```bash
gcloud compute firewall-rules delete edgenet-ingress
gcloud compute instances delete edgenet-1 --zone us-central1-a
```

##### Troubleshooting

If you encounter a problem, delete the instance and try again. If the problem persists you can SSH into the instance and
send us the logs of the startup script:

```bash
gcloud compute ssh edgenet-test-1 --zone us-central1-a
sudo journalctl -u google-startup-scripts.service
```

### Microsoft Azure

We recommend a `B2S` (2 vCPUs, 4 GiB of memory, ~45 USD/month) or larger instance.
See [Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) for the prices of the different instance
types.

#### From the CLI

Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and run:

```bash
az vm create ...
```

## Technical details

We use [Ansible](https://www.ansible.com/) to deploy nodes. See
the [EdgeNet-Project/node](https://github.com/EdgeNet-project/node/) repository for more information.
