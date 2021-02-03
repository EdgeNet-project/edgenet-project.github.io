---
layout: page
title: Contributing a Node
nav_order: 2
---

## From a public cloud

### Amazon AWS

The EdgeNet node AMI (Amazon Machine Image) identifier is `ami-04fe1e49f9fd33bac`.  
You can create a node from the command line, by installing the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and running:
```bash
aws ec2 run-instances --image-id ami-04fe1e49f9fd33bac --instance-type t3.small
```
Alternatively, you can use the [EC2 Management Console](https://console.aws.amazon.com/ec2/v2/home) from your web browser.

We recommend a `t3.small` (2 vCPUs, 1 GiB of memory, ~16 USD/month) or larger instance.  
See <https://aws.amazon.com/ec2/pricing/on-demand/> for the list of the instance types.

### Google Cloud Platform

Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and run:
```bash
gcloud compute instances create ...
```

### Microsoft Azure

Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and run:
```bash
az vm create ...
```

## From a dedicated machine

```bash
bash -c "$(wget -O - https://edge-net.org/bootstrap.sh)"
```