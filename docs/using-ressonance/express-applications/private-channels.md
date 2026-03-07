---
sidebar_position: 2
slug: /using-ressonance/express/private-channels
title: Using private channels with Express
---

## Using private channels with Express

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

app.post("/authorize", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const authResponse = pusher.authorizeChannel(socketId, channel);
  res.send(authResponse);
});

app.get("/send-private-event", (req, res) => {
  pusher.trigger("private-channel", "new-order", { order: "New Samsung Galaxy Sold" });
  res.send("Private Event sent!");
});

const port = process.env.PORT || 5000;
app.listen(port);
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
