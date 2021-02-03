---
layout: default
title: Authorities
parent: Kubernetes Extensions
---

Authorizations to use EdgeNet are handed out hierarchically, so that local administrators approve local users who they know. The central administrators of EdgeNet approve the establishment of authorities, each authority having its own local authority administrator called an authority-admin. An authority-admin, in turn, approves the creation of individual user accounts. Authority-admins also approve the creation of teams, which group users. And the authority-admins may be responsible for nodes that are contributed to the EdgeNet cluster. Authority Operations in EdgeNet consist of two Custom Resource Definitions; AuthorityRequests, and Authorities. Those allow us to enable user roles that we desired in Kubernetes. You could find the details of each below. There is a public endpoint, can be interacted using public kubeconfig file, for the requests of authority and user registrations.

![Authorities]({{ site.baseurl }}/assets/images/authority.jpg)

The Authority CRD, as a non-namespaced API resource, enables establishing the user role models that we desired and designed in Kubernetes. Thereby, a user group with a hierarchy of authority responsibility can use EdgeNet under the roof of a authority. Moreover, a authority hosts the teams that allow the users of that authority to create slices freely, and the slices that users can deploy their applications, by the respect of resource quota constraints of that slice, towards the EdgeNet cluster.

Only cluster admins and authority requests approved by cluster admins may create a authority object in EdgeNet. To create a authority, no other users are allowed or there is no other way. When a authority is created, an authority-admin user is created based on the Authority's contact information.

## Authority Requests

The AuthorityRequests CRD, as a non-namespaced API resource, provides a public endpoint to allow making authority registration requests independently. A user who wishes to register his authority at EdgeNet can do that directly by using the EdgeNet Portal or by kubectl with an EdgeNet public kubeconfig file that can be obtained by requesting the portal to a valid email address.

The controller behind this custom resource automatically removes the registration request after 72 hours if the registration request is not approved by a cluster-admin. When a authority request object is created, the system sends an email verification object to the contact of that authority. Cluster-admins are not notified until the email is verified. In case of a cluster-admin approves a authority request, the controller creates a authority object according to the authority request which gets deleted after.

But, how it works?
When a registration request has been made, EdgeNet sends an email including a one-time code for the email verification of that user. That is to avoid struggling with fake registration requests. At this point, there is no notification reaches to the email address of the EdgeNet cluster admin. Then, authority-admins verified their email address, need to be done in 24 hours, by using the one-time codes they received.

This is the time the cluster-admin needs to take action that is approving the request before 72 hours in total passed away. Because the admin gets a notification about the authority requests since authority-admin verified the email address. In the next steps, the authority request controller creates a authority object according to request data. And, when a authority is created in EdgeNet, the authority controller generates a namespace by combining the authority name and the string of “authority” as a prefix, then sets a resource quota in it to prevent deploying applications in this namespace, and creates an authority-admin user. Herewith, the authority controller sends a notification that says your authority creation is successful while the user controller creates a service account dedicated to the user and generates a kubeconfig file to deliver it along with the user information by email. Authority-admin can now start using EdgeNet with the user-specific kubeconfig file, which means authority-admin is ready to welcome user registration requests on the authority. 
