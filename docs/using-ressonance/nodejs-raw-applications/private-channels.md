---
sidebar_position: 2
slug: /using-ressonance/nodejs-raw/private-channels
title: Using private channels with Nodejs
---

## Using private channels with Nodejs

You can use private channels to send information to authenticated users:

- Personal notifications.
- Apply discounts to products based on previous purchases.
- Private chat messages.

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
                enabledTransports: ["ws", "wss"],
                channelAuthorization: {
                    endpoint: "https://your.appdomain.example/authorize"
                },
            });

            var privateChannel = pusher.subscribe("private-channel");
            privateChannel.bind("new-order", (data) => {
                alert("New order received", data.order);
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

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => resolve(new URLSearchParams(body)));
    req.on("error", reject);
  });

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/authorize") {
    parseBody(req)
      .then((params) => {
        const socketId = params.get("socket_id");
        const channel = params.get("channel_name");
        const authResponse = pusher.authorizeChannel(socketId, channel);
        sendJson(res, 200, authResponse);
      })
      .catch(() => sendJson(res, 400, { message: "Invalid payload." }));
    return;
  }

  if (req.method === "GET" && req.url === "/send-private-event") {
    pusher
      .trigger("private-channel", "new-order", { order: "New Samsung Galaxy Sold" })
      .then(() => sendJson(res, 200, { message: "Private Event sent!" }))
      .catch(() => sendJson(res, 500, { message: "Failed to send event." }));
    return;
  }

  sendJson(res, 404, { message: "Not found." });
});

const port = process.env.PORT || 5000;
server.listen(port);
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
