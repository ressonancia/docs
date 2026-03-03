---
sidebar_position: 1
slug: /using-ressonance/express/public-channels
title: Using public channels with Express
---

## Using public channels with Express

Public channels do not require authentication. Public channels can be used for features without sensitive information, such as these use cases:

- Notify all users with the e-commerce page loaded when a new product goes on sale.
- Live chat similar to YouTube chat.
- Trigger updates for all clients currently viewing a page when it changes.

## Frontend

```html
<html>
    <body>
       <h1>Pusher test</h1> 
      <script>
        document.addEventListener('DOMContentLoaded', function() {
            var pusher = new Pusher("RESSONANCE_APP_ID", {
                cluster: "default",
                wsHost: "websocket.ressonance.com",
                wsPort: 443,                  
                wssPort: 443,                 
                forceTLS: true,               
                disableStats: true,            
                enabledTransports: ["ws", "wss"]
            });

            var channel = pusher.subscribe("public-channel");

            channel.bind("new-release", (data) => {
                alert("New release", data.release);
            });
        });
      </script>
      <script src="https://js.pusher.com/8.3.0/pusher.min.js"></script>  
    </body>
</html>
```


## Backend

```sh
npm install --save pusher
```
This is a small Express example application.

```javascript
const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");

var pusher = new Pusher({
  appId: "RESSONANCE_APP_ID",
  key: "RESSONANCE_APP_KEY",
  secret: "RESSONANCE_APP_SECRET",
  host: "websocket.ressonance.com",
  port: 443,
  useTLS: true
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/send-public-event", (req, res) => {
  pusher.trigger("public-channel", "new-release", { release: "hello world" });
  res.send("Event sent!");
});

const port = process.env.PORT || 5000;
app.listen(port);
```
