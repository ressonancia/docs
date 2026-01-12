---
sidebar_position: 1
slug: /self-hosted/running-as-docker-containers
title: Docker Containers
---

# Running Ressonance Self-Hosted as Docker Containers

To run Ressonance as a Docker container, run:

```sh
docker pull ressonancia/ressonance

docker run -it --rm \
    -p 80:80 \
    -p 8000:8000 \
    -p 8080:8080 \
    ressonancia/ressonance
```

This exposes the Ressonance dashboard on port 80.


# Docker Compose

```yaml
services:
  ressonance:
    image: ressonancia/ressonance
    restart: always
    ports:
      - "80:80"
      - "8000:8000"
      - "8080:8080"
```

# Accessing the container

The container exposes three ports:

| Port | Service          | Description                              |
|------|------------------|------------------------------------------|
| 80   | Dashboard        | Web interface for managing the platform  |
| 8000 | Dashboard API    | API used by the dashboard                |
| 8080 | WebSocket API    | WebSocket endpoint for real-time events. Use this URL in your environment variables.  |

The experience should be very similar to Ressonance Cloud.
