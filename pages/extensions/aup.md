---
layout: default
title: Acceptable Use Policy
parent: Kubernetes Extensions
---

The Acceptable Use Policy (AUP) CRD, as a namespaced API resource, ensures that EdgeNet is GDPR compliant. Any user registered in a authority has to accept this policy to start using EdgeNet. A user must accept this policy every 6 months.

The controller behind this custom resource automatically turns the AUP object into unaccepted after six months if the AUP is not accepted and extended in this period.
