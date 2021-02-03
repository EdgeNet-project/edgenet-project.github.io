---
layout: default
title: Email Verifications
parent: Kubernetes Extensions
---

The Email Verification CRD, as a namespaced API resource, enables EdgeNet make email verifications in Kubernetes. The system sends an email providing a unique identifier that allows a user to verify the email address.

The controller behind this custom resource automatically removes an email verification object after 72 hours if the email is not verified by the owner.
