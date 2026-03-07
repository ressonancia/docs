---
sidebar_position: 2
slug: /using-ressonance/python/private-channels
title: Using private channels with Python
---

## Using private channels with Python

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
pip install pusher
```
This is a small Python example application.

```python
# File main.py
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import pusher


pusher_client = pusher.Pusher(
    app_id="RESSONANCE_APP_ID",
    key="RESSONANCE_APP_KEY",
    secret="RESSONANCE_APP_SECRET",
    host="websocket.ressonance.com",
    port=443,
    ssl=True,
)


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status_code, payload):
        self.send_response(status_code)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def parse_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length).decode("utf-8") if length else ""
        content_type = self.headers.get("Content-Type", "")

        if "application/json" in content_type:
            try:
                return json.loads(raw_body or "{}")
            except json.JSONDecodeError:
                return {}

        form_data = parse_qs(raw_body)
        return {key: values[0] for key, values in form_data.items()}

    def do_POST(self):
        if self.path == "/authenticate":
            payload = self.parse_body()
            socket_id = payload.get("socket_id")

            if not socket_id:
                self.send_json(400, {"error": "socket_id is required"})
                return

            # Replace this with real user lookup
            user = {
                "id": "some_id",
                "user_info": {"name": "John Smith"},
                "watchlist": ["another_id_1", "another_id_2"],
            }
            auth_response = pusher_client.authenticate_user(socket_id, user)
            self.send_json(200, auth_response)
            return

        if self.path == "/authorize":
            payload = self.parse_body()
            socket_id = payload.get("socket_id")
            channel = payload.get("channel_name")

            if not socket_id or not channel:
                self.send_json(400, {"error": "socket_id and channel_name are required"})
                return

            # This authenticates every user. Don't do this in production!
            auth_response = pusher_client.authenticate(channel, socket_id)
            self.send_json(200, auth_response)
            return

        self.send_json(404, {"message": "Not found."})

    def do_GET(self):
        if self.path == "/send-private-event":
            pusher_client.trigger(
                "private-channel", "new-order", {"order": "New Samsung Galaxy Sold"}
            )
            self.send_json(200, {"message": "Private Event sent!"})
            return

        self.send_json(404, {"message": "Not found."})


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 5000), Handler)
    server.serve_forever()
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
