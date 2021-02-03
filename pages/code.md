---
layout: page
title: Source Code
---

[The EdgeNet API](https://github.com/EdgeNet-project/edgenet) is a Kubernetes API extension written in [Go](https://golang.org/) that is only accessible via the kubectl and the portals we develop. For being compatible with Kubernetes, it gets the benefit of [client-go](https://github.com/kubernetes/client-go) for talking to the Kubernetes cluster of EdgeNet, and [Kubernetes Go packages](https://godoc.org/k8s.io/kubernetes) for taking the advantage of functionallities already developed for Kubernetes. It also makes use of the Namecheap API for configuring DNS records, corresponding the names including `edgenet.io` domain name, of the nodes added into the cluster. Addition to these, a custom controller called nodelabeler lists and watches the nodes of the cluster to detect add & edit node operations, and then attaches geolabels on them by using [GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/).

[Visit EdgeNet's GitHub Repository](https://github.com/EdgeNet-project/edgenet){: .btn .btn-purple }

## Architecture

Resources are endpoints of the Kubernetes API to store objects separately by kinds. Kubernetes has a built-in feature that allows developers to generate customized resources dedicated their particular needs. These solutions called as custom resources in Kubernetes, which enables users to create, edit, and delete objects belong to a custom resource in the way they do for built-in resources by invoking kubectl. Thus, these custom solutions become a part of Kubernetes and thanks to this feature we can avoid forcing user to learn a new syntax. In EdgeNet, we use CustomResourceDefinitions (CRDs) to extend the Kubernetes API. Although CustomResourceDefinitions don't provide flexibility because of its restrictions, they don't require to develop a new API server, saves us from a plent of coding task, as they use the native Kubernetes API Server. 

TODO TODO : Legend + side by side.
<img alt="CRDs" src="{{ site.baseurl }}/assets/images/custom-resources.png" width="40%"/>
<img alt="EdgeNet Architecture" src="{{ site.baseurl }}/assets/images/architecture.png" width="40%"/>

The idea behind the development of EdgeNet is meeting distributed testbed requirements by using a common framework that is Kubernetes in this case. EdgeNet aims being fully aling with Kubernetes to be able to contribute back to the community. The custom resources feature of Kubernetes allows us to do so. Because all new features we develop as custom resources are automatically adopted by kubectl. The features such as hardware management, logging & monitoring, and privacy & security at Edge in scope of EdgeNet's vision!

[API Documentation](https://documenter.getpostman.com/view/7656709/SzYT4gRL?version=latest){: .btn .btn-purple }