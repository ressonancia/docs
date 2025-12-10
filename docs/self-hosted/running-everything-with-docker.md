---
sidebar_position: 4
---

# Running everything with docker

You can also run run our backend API and our frontend SPA together by running our docker image. This docker image has a new release every week.

## Ressonance Open Source Image

Ressonance WebSocket server built on top of [Laravel Reverb](https://reverb.laravel.com/). When using Ressonance you can manage your WebSocket applications at the UI instead of configuration files.

Ressonance is Open Source and you can run a self hosted version with Docker or you can consume Ressonance as a service using [Ressonance Cloud](https://www.ressonance.com/).

## How to run and access a self hosted Ressonance

The easiest way to run Ressonance is Docker:

```
docker run --rm -p 80:80 -p 8000:8000 -p 8080:8080 ressonancia/ressonance:latest
```

After running the command you can access Ressonance at [http://localhost](http://localhost).

The container should output the credentials like this:

![](https://github.com/ressonancia/docker-image/blob/main/resources/output.png?raw=true)

## Docker Compose

With Docker Compose you can run Ressonance like this.

```yml
services:
  ressonance:
    image: ressonancia/ressonance:latest
    container_name: ressonance
    ports:
      - "80:80"
      - "8000:8000"
      - "8080:8080"
```
