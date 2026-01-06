---
sidebar_position: 1
slug: /self-hosted/running-as-docker-containers
title: Docker Containers
---

# Running Ressonance Self Hosted as Docker Containers

To run ressonance as a Docker Container just run:

```sh
docker pull ressonancia/ressonance

docker run -it --rm \
    -p 80:80 \
    -p 8000:8000 \
    -p 8080:8080 \
    ressonancia/ressonance
```

This will expose ressonance dashboard at port 80.


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

# Acessing the container

The conteiner should expose 3 ports like explained:

| Port | Service          | Description                              |
|------|------------------|------------------------------------------|
| 80   | Dashboard        | Web interface for managing the platform  |
| 8000 | Dashboard API    | API used by the dashboard                |
| 8080 | WebSocket API    | WebSocket endpoint for real-time events. This por you should reference at your environment variables  |

The experience should be very similar to Ressonance Cloud