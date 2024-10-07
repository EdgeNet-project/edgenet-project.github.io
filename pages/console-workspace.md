---
layout: page
parent: Accessing EdgeNet
title: Workspaces
nav_order: 2
---

## Create a new workspace
You can create a new workspace directly in the dashboard by clicking the button "Create a new workspace" 
and selecting the team under which the workspace will be requested. You can create a workspace only if you are already part of a team.
A request will be sent to the team admins for validation. Once done your workspace will appear in the dashboard and
on the navigation menu.
You will then be able to download the kubeconfig file and deploy your application under this workspace.

Each workspace has a unique isolated namespace on the EdgeNet cluster, your application can be deployed under this
namespace.

## Join an existing workspace
You can also join an existing workspace by clicking on the button "Join a workspace" in your dashboard.
A new request will be created and sent to the administrators of the related team, once approved you will be 
able to use the workspace.