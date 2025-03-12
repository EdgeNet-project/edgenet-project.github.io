---
layout: home
title: Features
nav_order: 2
---

# Features

## Multitenancy

### Tenant

EdgeNet enables the utilization of a shared cluster by multiple tenants who lack 
trust in each other. Tenants can allocate resource quotas or slices, 
and they also have the ability to offer their resources to other tenants.

This functionality empowers tenants to function both as providers and consumers, 
operating in both vendor and consumer modes.

Multitenancy is enabled by using CRDs (Custom Resource Definitions) and it leverages the 
RBAC authorization model used in Kubernetes.

### Subnamespace

The subnamespace object in Kubernetes serves as a mechanism to emulate hierarchical
namespaces within the flat namespace structure. Upon approval of a tenant request, 
a subnamespace is dynamically generated in tandem with the tenant. This subnamespace, 
referred to as the core namespace, bears the same name as the tenant.

In addition to the core namespace creation, tenants are empowered to define the 
resources that should be propagated to the subnamespace. This includes a range of 
Kubernetes objects such as network policies, rbacs, limit ranges, secrets, config maps, 
and service accounts. By setting the corresponding property value to true, tenants can 
selectively share these Kubernetes objects with the subnamespace, enabling seamless resource 
access and utilization within the tenant's environment.

## Multiprovider

By accommodating the collaboration of diverse providers, EdgeNet encourages numerous 
entities to contribute to nodes, thus fostering a rich and expansive ecosystem that 
thrives on heterogeneity. With the power of multitenancy, contributors with different 
hardware can easily lend their hardware.

### Node contribution

When a new node is added to the cluster using a bootstrap script, it triggers the activation 
of a node contribution object. This object encompasses vital information regarding the node 
provider, SSH details, limitations, and user-related data. Below is the OpenAPI specification 
for the node contribution object in yaml format.