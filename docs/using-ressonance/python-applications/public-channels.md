---
sidebar_position: 1
slug: /using-ressonance/python/public-channels
title: Using public channels with Python
---

## Using public channels with Python

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
pip install pusher
```
This is a small Python example application.

```python
# File main.py
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
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

    def do_GET(self):
        if self.path == "/send-public-event":
            pusher_client.trigger("public-channel", "new-release", {"release": "hello world"})
            self.send_json(200, {"message": "Event sent!"})
            return

        self.send_json(404, {"message": "Not found."})


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 5000), Handler)
    server.serve_forever()
```
