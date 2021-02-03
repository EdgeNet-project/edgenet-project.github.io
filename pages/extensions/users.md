---
layout: default
title: Users
parent: Kubernetes Extensions
---

The User CRD, as a namespaced API resource, assigns service accounts to users and delivers kubeconfig file that generated according to that service account. The system attaches role bindings to service account based on their user roles to fulfill desired user role models. Thereby, a user can do actions that correspond to the user role in Kubernetes. Only cluster admins or authority-admins(s) of that authority and user registration requests approved by a cluster-admin or an authority-admin or a manager of that authority may create a user object in EdgeNet. To create a user, no other users are allowed or there is no other way. Authority-admin can change user roles after user object is created.

![Users]({{ site.baseurl }}/assets/images/user.jpg)

## User Registration Requests

The UserRegistrationRequests CRD, as a namespaced API resource, provides a public endpoint to allow making user registration requests to authorities independently. A user who wishes to register himself to a authority at EdgeNet can do that directly by using the EdgeNet Portal or by kubectl with an EdgeNet public kubeconfig file that can be obtained by requesting the portal to a valid email address. The user registration request only covers the regular user role.

The controller behind this custom resource automatically removes the registration request after 72 hours if the registration request is not approved by a cluster-admin or an authority-admin or a manager of that authority. When a user registration object is created, the system sends an email verification object. The authority-admin(s) and manager(s) are not notified until the email is verified. When a user registration request gets approved, the controller creates a user object according to the user registration request which gets deleted after.

Likely authority-admins have been done, but with a difference, users make registration requests on authorities that already registered in EdgeNet. And again EdgeNet has the same procedure about email verification to prevent fake requests on the authorities that would be boring for authority-admins if EdgeNet informs them about all requests without email verification. As authority-admins receive the kubeconfig file by email, the user controller delivers the user information along with a kubeconfig file to the user's email address. So, users can now start using EdgeNet as well. But, the authority namespace is not a workspace which users collaborate with. 
