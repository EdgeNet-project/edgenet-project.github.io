---
layout: page
title: Acceptable Use Policy
nav_order: 4
---

# EdgeNet Acceptable Use Policy

EdgeNet is an overlay testbed designed to allow researchers to experiment with network applications and services that
benefit from distribution across a wide geographic area. All uses of EdgeNet should be consistent with this high-level
goal.

## Guidelines

As an overlay, EdgeNet is not a "testbed" in the usual sense of a controlled environment for experiments. It consists of
computational resources hosted by organizations (principally research institutions like universities) and individuals
that donate virtual machines and network connectivity for the good of the community. Running an experiment on EdgeNet is
fundamentally different from running it in a LAN-based lab or on an isolated wide-area testbed.

A good litmus test when considering whether an experiment is appropriate for EdgeNet is to ask what the network
administrator at your institution would say about the experiment running there. If the experiment disrupts local
activity (e.g., uses more than its share of your institution's Internet bandwidth) or triggers complaints from remote
network administrators (e.g., performs systematic port scans), then it is not appropriate for EdgeNet. It is your
responsibility to ensure that your use of EdgeNet falls within these constraints. This means that you should debug your
code in a controlled environment so that you have confidence that you understand its behavior. EdgeNet is also designed
to allow experimental services to run continuously, thereby supporting an end-user community. As a consequence, EdgeNet
could indirectly support users that have not officially registered with EdgeNet, and may even be unknown to you (the
service provider). It is your responsibility to ensure that your users do not cause your service to violate the terms of
this AUP. In particular, service providers should ensure that their users are not able to hijack the service and use it
to attack or spam other nodes or network users.

Among its many uses, EdgeNet is designed to support network measurement experiments that purposely probe the Internet.
However, we expect all users to adhere to widely-accepted standards of network etiquette in an effort to minimize
complaints from network administrators. Activities that have been interpreted as worm and denial-of-service attacks in
the past (and should be undertaken only with considerable caution) include sending SYN packets to port 80 on random
machines, probing random IP addresses, repeatedly pinging routers, overloading bottleneck links with measurement
traffic, and probing a single target machine from many EdgeNet nodes.

It is likely that institutional hosts of EdgeNet nodes will have their own AUPs. Users should not knowingly violate such
local AUPs. Conflicts between site AUPs and EdgeNet's stated goal of supporting research into wide-area networks should
be brought to the attention of EdgeNet administrators.

While the central EdgeNet authority is often the first point-of-contact for complaints about misbehaving services, it is
our policy to put the complainant in direct contact with the researcher who is responsible for the service. EdgeNet
provides absolutely no privacy guarantees with regards to the network. In fact, users should assume that packets will be
monitored and logged, for example, to allow other users and EdgeNet administrators to investigate abuse (see previous
paragraph). EdgeNet also does not provide any guarantees with respect to the reliability of individual nodes, which may
be rebooted or reinstalled at any time. Reinstalling a node implies that its local storage is wiped, meaning that users
should not treat it as a persistent form of storage.

## Overall Rules

EdgeNet should not be used for any illegal or commercial activities. Use for research and educational purposes is
allowed.

## Node Usage Rules

- Use existing security mechanisms. For example, all access to EdgeNet nodes should be via standard Kubernetes
  mechanisms, such as kubectl or the dashboard. You may also enable SSH access to the containers that you deploy, and
  access them in that way.
- Do not circumvent accounting and auditing mechanisms. This means that you must associate your persona identity with
  your EdgeNet account, and you must not do anything to obfuscate any audit trail.
- You may not engage in hacking of EdgeNet nodes. This includes "red team" (hacker test) experiments. All access is
  non-root.
- Avoid spin-wait for extended periods of time. If possible, do not spin-wait at all.

## Network Usage Rules

- Do not use your EdgeNet account to gain access to host node resources other than your own EdgeNet containers.
- Do not use one or more EdgeNet nodes to flood a site with so much traffic as to interfere with its normal operation.
  Use congestion controlled flows for large transfers.
- Do not conduct systematic or random port or address block scans, source address spoofing, or sniffing of traffic,
  without first having your methodology cleared by the EdgeNet administrators.

## Consequences

Violations of this AUP may result in any of the following:

- disabling of your account
- disabling of the local authority that granted you your account
- informing your institution's administration

If you have any questions, or to report a suspected violation of this policy, please contact EdgeNet Support at
<edgenet-support@planet-lab.eu>.

AUP version of 23 March 2020
