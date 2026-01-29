---
sidebar_position: 3
slug: /self-hosted/storing-data-on-mysql
title: How to store data on MySQL
---


# How to store data on MySQL

The Ressonance open source version uses SQLite to store data like users and apps. Switching to MySQL is as simple as updating a few environment variables.

Take a look at this docker-compose.yml:


```yaml
services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: ressonance
      MYSQL_USER: ressonance
      MYSQL_PASSWORD: change_me
      MYSQL_ROOT_PASSWORD: change_me_root
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  ressonance:
    image: ressonancia/ressonance
    restart: always
    depends_on:
      - mysql
    environment:
      DB_CONNECTION: mysql
      DB_HOST: mysql
      DB_PORT: 3306
      DB_DATABASE: ressonance
      DB_USERNAME: ressonance
      DB_PASSWORD: change_me
    ports:
      - "80:80"
      - "8000:8000"
      - "8080:8080"

volumes:
  mysql_data:
```

**Note:** The first time you run MySQL in Docker, as in the example, the database needs a few seconds to be provisioned. On that first run, Ressonance may start before MySQL is ready and fail to connect. Just restart the containers and it should work as expected.
