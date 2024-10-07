---
layout: "page"
title: "About"
nav_order: 5
---

# About EdgeNet

EdgeNet, the globally distributed edge cloud for Internet researchers, is based on industry-standard 
Cloud software, using Docker for containerization and Kubernetes for deployment and node management.
If you know how to deploy containers with Kubernetes, you know how to use EdgeNet; we welcome you to 
[register for a free account]({{ site.baseurl }}{% link pages/running-experiments.md %}) today.
Anyone who wishes to do so may [contribute an EdgeNet node]({{ site.baseurl }}{% link pages/node-contribution.md %}) 
-- it just takes five minutes -- and thereby support the not-for-profit research that is conducted on the platform.  

## The EdgeNet Team

EdgeNet is overseen by Rick McGeer, Timur Friedman, Olivier Fourmaux, and Justin Cappos, and is a 
joint project of [US Ignite](https://www.us-ignite.org), the [LIP6](https://www.lip6.fr/) lab
at [Sorbonne University](https://www.sorbonne-universite.fr/),
the [NYU Tandon School of Engineering](https://engineering.nyu.edu/),
the [Swarm Lab](https://swarmlab.berkeley.edu/home) at [UC Berkeley](https://www.berkeley.edu/),
the [Computer Science department](https://www.uvic.ca/engineering/computerscience/) at
the [University of Victoria](https://www.uvic.ca/), 
the [University of Vienna](https://www.univie.ac.at/),
and [cslash/](https://cslash.com).

The lead developer is Berat Senel, and Maxime Mouchet and [Ciro Scognamiglio](https://cslash.com) are principal
members of the development team.

The EdgeNet control plane is operated by the [Dioptra](https://dioptra.io) group at Sorbonne University, 
which also runs [PlanetLab Europe](https://www.planet-lab.eu/).
If you need help with EdgeNet, kindly contact us at <support@edge-net.org>.

## Publications Citing EdgeNet

If you have used the EdgeNet platform to conduct research, please email us about your 
publications that cite EdgeNet and we will add them to this list.

[Monitoring an anonymity network: Toward the deanonymization of hidden services](https://dfrws.org/wp-content/uploads/2021/01/2021_APAC_paper-monitoring_an_anonymity_network-toward_the_deanonymization_of_hidden_services.pdf)  
M. Simionia, P. Gladysheva, B. Habibniaa, and P. R. N. de Souzac  
DFRWS APAC 2021

## The EdgeNet Architecture

EdgeNet is implemented as a set of Kubernetes extensions based
on [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/). The
EdgeNet source code is freely available on GitHub, and the EdgeNet architecture is described in several scientific
papers that are available via HAL.

[EdgeNet's GitHub Repository](https://github.com/EdgeNet-project/edgenet){: .btn .btn-blue }
[EdgeNet's publications on HAL](https://hal.archives-ouvertes.fr/search/index?q=EdgeNet){: .btn .btn-blue }


## Acknowledgements

EdgeNet is supported by a [VMware](https://www.vmware.com/) charitable donation to the Sorbonne University Foundation, 
and also receives support through a cybersecurity grant from the French Ministry of Armed Forces.
It participates in the European Commission's Horizon 2020 funding program through the [Fed4FIRE+](https://www.fed4fire.eu/) 
project and, recently, through the [NGIatlantic.eu](https://ngiatlantic.eu/) project.
The initial funding for EdgeNet came from a US [National Science Foundation](https://www.nsf.org/) EAGER grant under 
contract CNS-1820901.

EdgeNet nodes are supported by funding from the US [National Science Foundation](https://www.nsf.org/)'s [CloudBank](https://www.cloudbank.org) 
initiative, and through hardware made available by the US [GENI](https://geni.net) and [ExoGENI](http://www.exogeni.net/) projects and
Canada’s [SAVI](https://www.savinetwork.ca/) project.
EdgeNet users and [PlanetLab Europe](https://www.planet-lab.eu/) users also contribute nodes.
