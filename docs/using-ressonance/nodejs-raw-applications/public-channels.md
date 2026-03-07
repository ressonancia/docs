---
sidebar_position: 1
slug: /using-ressonance/nodejs-raw/public-channels
title: Using public channels with Nodejs
---

## Using public channels with Nodejs

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
This is a small Nodejs example application.

```javascript
const http = require("http");
const Pusher = require("pusher");

var pusher = new Pusher({
  appId: "RESSONANCE_APP_ID",
  key: "RESSONANCE_APP_KEY",
  secret: "RESSONANCE_APP_SECRET",
  host: "websocket.ressonance.com",
  port: 443,
  useTLS: true
});

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/send-public-event") {
    pusher
      .trigger("public-channel", "new-release", { release: "hello world" })
      .then(() => sendJson(res, 200, { message: "Event sent!" }))
      .catch(() => sendJson(res, 500, { message: "Failed to send event." }));
    return;
  }

  sendJson(res, 404, { message: "Not found." });
});

const port = process.env.PORT || 5000;
server.listen(port);
```
