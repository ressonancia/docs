---
sidebar_position: 1
slug: /using-ressonance/flesk/public-channels
title: Using public channels with Flesk
---

## Using public channels with Flesk

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
pip install pusher flask flask-cors
```
This is a small Flesk example application.

```python
# File main.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pusher

app = Flask(__name__)
CORS(app)

pusher_client = pusher.Pusher(
    app_id="RESSONANCE_APP_ID",
    key="RESSONANCE_APP_KEY",
    secret="RESSONANCE_APP_SECRET",
    host="websocket.ressonance.com",
    port=443,
    ssl=True
)

@app.route("/send-public-event", methods=["GET"])
def send_public_event():
    pusher_client.trigger("public-channel", "new-release", {
        "release": "hello world"
    })
    return "Event sent!"

if __name__ == "__main__":
    port = 5000
    app.run(host="0.0.0.0", port=port)
```
