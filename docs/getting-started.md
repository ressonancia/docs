---
sidebar_position: 2
slug: /getting-started
title: Getting Started
---

# Getting Started

Ressonance can be run in two different ways, depending on how much control and operational responsibility you want. You can use the fully managed [cloud service](https://www.ressonance.com/), where everything is handled for you, or you can self-host Ressonance on your own infrastructure using Docker. Both options provide the same real-time WebSocket capabilities — the difference is how and where the service runs.


# Cloud Option: Ressonance Managed WebSockets

The Ressonance Cloud option is a fully managed WebSocket service. You don’t need to provision servers, configure scaling, or worry about uptime. After creating an application in the Ressonance dashboard, you simply configure your environment variables and start broadcasting real-time events from your application.

What are the advantages:

- No infrastructure or servers to manage
- Automatic scaling and high availability
- Secure, encrypted WebSocket connections
- Simple integration with Laravel and other backends
- Predictable pricing with free and paid plans

This option is ideal for teams who want to focus on product development rather than infrastructure and operations.

Proceed to [Using Ressonance](/category/using-ressonance) section to create a cloud account.

# Self-Hosted Option: Using docker image (ressonancia/ressonance)

The self-hosted option allows you to run Ressonance on your own infrastructure using the official Docker image `ressonancia/ressonance`. This gives you full control over networking, scaling strategy, logging, and deployment topology.

A typical setup looks like this:

```sh
docker pull ressonancia/ressonance

docker run -it --rm \
    -p 80:80 \
    -p 8000:8000 \
    -p 8080:8080 \
    ressonancia/ressonance
```

This option is best suited for teams with existing infrastructure, compliance requirements, or a need for full operational control.

Go to [Self Hosted](/category/using-ressonance) to find all instructions about self hosting.

# Cloud vs Self-Hosted Comparison

| Aspect          | Cloud (Managed)      | Self-Hosted (Docker)              |
| --------------- | -------------------- | --------------------------------- |
| **Setup time**  | Minutes              | Requires infrastructure setup     |
| **Maintenance** | Fully managed        | Your responsibility               |
| **Scaling**     | Automatic            | Manual or via your own automation |
| **Control**     | Limited              | Full control                      |
| **Costs**       | Subscription-based   | Infrastructure & ops costs        |
| **Best for**    | Simplicity and speed | Customization and control         |


**In summary:**

Choose Cloud if you want the fastest setup with minimal operational effort.

Choose Self-Hosted if you need full control over how and where Ressonance runs.

Both options deliver the same real-time experience — the choice depends on how much infrastructure ownership you want.