---
layout: default
title: Teams
parent: Kubernetes Extensions
---

The Teams CRD, as a namespaced API resource, empowers users to create slices independently, rather than just sticking this authorization to authority admins and managers. Participants of a team, ie users, may belong to different authorities. And, the authority-admin(s) and manager(s) of the authority on which team created are natural participants of that team.

![Teams]({{ site.baseurl }}/assets/images/team.jpg)

When a team object is created, the controller crafts a namespace that provides general authorization to create slices on it. Thereby, any participant of a team can create a slice freely. Additionally, the authority-admin(s) and manager(s) of the authority on which team created and the participants of the team get their invitations by email containing team information.

Authority-admins or Managers authorized by authority-admins can create teams by choosing users from different authorities. When a team is created, the team controller generates a namespace and sets the name by combining authority namespace and team name. For example, authority-a-team-a as you can see at the top middle of this slide. But, it is not allowed to deploy applications in a team namespace either. However, a team namespace authorizes users who participate in, to create slices in the team namespace.

Users participating in a team namespace can create slices by choosing users from different authorities. When a slice is created, the slice controller generates a namespace the same as the team controller does but it sets a resource quota depending on the slice profile. 