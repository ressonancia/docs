---
sidebar_position: 2
slug: /using-ressonance/flask/private-channels
title: Using private channels with Flask
---

## Using private channels with Flask

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
pip install pusher flask flask-cors
```
This is a small Flask example application.

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

@app.route("/authenticate", methods=["POST"])
def authenticate():
    socket_id = request.form.get("socket_id") or request.json.get("socket_id")

    # Replace this with real user lookup
    user = {
        "id": "some_id",
        "user_info": {
            "name": "John Smith",
        },
        "watchlist": ["another_id_1", "another_id_2"]
    }

    auth_response = pusher_client.authenticate_user(socket_id, user)
    return jsonify(auth_response)


@app.route("/authorize", methods=["POST"])
def authorize():
    socket_id = request.form.get("socket_id") or request.json.get("socket_id")
    channel = request.form.get("channel_name") or request.json.get("channel_name")

    # This authenticates every user. Don't do this in production!
    # For private/presence channels use `authenticate(channel, socket_id, custom_data=None)`
    auth_response = pusher_client.authenticate(channel, socket_id)
    return jsonify(auth_response)

@app.route("/send-private-event", methods=["GET"])
def send_private_event():
    pusher_client.trigger("private-channel", "new-order", {
        "order": "New Samsung Galaxy Sold"
    })
    return "Private Event sent!"


if __name__ == "__main__":
    port = 5000
    app.run(host="0.0.0.0", port=port)
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
