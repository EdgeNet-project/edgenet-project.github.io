---
layout: default
title: Slices
parent: Kubernetes Extensions
---

The Slices CRD, as a namespaced API resource, allows users to deploy their applications towards the cluster. There are three slice profiles, which are Low, Medium, and High, that directly impacts on the expiration date and resource quota. Participants of a slice, ie users, may belong to different authorities. And, the authority-admin(s) and manager(s) of the authority on which slice created are natural participants of that slice.

![Team Slice]({{ site.baseurl }}/assets/images/team-slice.jpg)

The controller behind this custom resource automatically removes a slice object after the expiration date expires if the slice is not extended. When a slice object is created, the controller sets an expiration date and crafts a namespace with a resource quota and those parameters are determined by the system depending on the slice profile. Additionally, the authority-admin(s) and manager(s) of the authority on which slice created and the participants of the slice get their invitations by email containing slice information. 

![Authority Slice]({{ site.baseurl }}/assets/images/authority-slice.jpg)