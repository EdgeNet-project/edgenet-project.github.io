---
layout: default
title: Selective Deployment
parent: Kubernetes Extensions
---


EdgeNet’s value as compared to vanilla Kubernetes is its ability to deploy containerized software to a widely distributed set of nodes rather than to nodes that are all grouped together in a centralized datacenter. As an EdgeNet user you want to choose your nodes based upon their locations. We give you the opportunity to do so based on continent, country, state/region, and city, as well as on polygons that you describe using latitudes and longitudes. Further development will increase your possibilities; please let us know what is important for you!

![Selective Deployment]({{ site.baseurl }}/assets/images/selective-deployment.jpg)

As a Kubernetes user, you are already comfortable with creating, updating, and deleting its DaemonSet, Deployment, and StatefulSet API resources so as to schedule Pods to a cluster’s nodes. If you create a DaemonSet then your Pods will run on all available nodes of the cluster, whereas with a Deployment or a StatefulSet, your Pods will run on as many nodes of the cluster as Kubernetes judges best, based upon its assessment of container resource consumption and available node resources, whereas. Whichever controller you choose in vanilla Kubernetes, you are indifferent to which nodes run your Pods, as they are all located in a centralized datacenter. But when you deploy to the edge cloud, you want to select nodes at particular locations for your Pods. Through EdgeNet, you can select those nodes by defining a subcluster. For instance, a DaemonSet defined as having five nodes in Germany and four in France will ensure that your Pods are deployed to nine nodes that meet those criteria.

The SelectiveDeployments CRD, as a namespaced API resource, enables deployments based on geolocations. The system basically reconfigures the native Kubernetes controllers, which are DaemonSet, Deployment, and StatefulSet, to fulfill its task.

When a selective deployment object is created, the controller adjusts node affinities of DaemonSets, Deployments, or StatefulSets existed in that object to establish deployment of applications according to the geolocations defined. The system searches the latitude & longitude information of nodes in a GeoIP database to pick up the nodes and set node affinities.
