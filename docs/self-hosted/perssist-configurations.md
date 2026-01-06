---
sidebar_position: 2
slug: /self-hosted/perssist-configuration
title: Pesssist Configuration
---

# How to ensure the configurations are perssisted

To perssist changes at the container after deleting or restarting you must define a volume:

```sh
touch ./database.sqlite
```

after touching:


```yaml
services:
  ressonance:
    image: ressonancia/ressonance
    restart: always
    ports:
      - "80:80"
      - "8000:8000"
      - "8080:8080"
    volumes:
      - ./database.sqlite:/var/www/app/database/database.sqlite

```