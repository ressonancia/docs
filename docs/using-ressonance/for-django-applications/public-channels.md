---
sidebar_position: 1
slug: /using-ressonance/django/public-channels
title: Using public channels with Django
---

## Using public channels with Django

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
This is a small Django example application.

```python
# File main.py
import json
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line
from django.http import HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
import pusher


# Configure Django settings for a single-file app.
if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY="dev-secret-key",
        ROOT_URLCONF=__name__,
        ALLOWED_HOSTS=["*"],
        INSTALLED_APPS=[
            "django.contrib.auth",
            "django.contrib.contenttypes",
            "corsheaders",
        ],
        MIDDLEWARE=[
            "corsheaders.middleware.CorsMiddleware",
            "django.middleware.common.CommonMiddleware",
        ],
        CORS_ALLOW_ALL_ORIGINS=True,
        DEFAULT_AUTO_FIELD="django.db.models.AutoField",
    )

django.setup()

# Pusher client setup (matches the Flask version).
pusher_client = pusher.Pusher(
    app_id="RESSONANCE_APP_ID",
    key="RESSONANCE_APP_KEY",
    secret="RESSONANCE_APP_SECRET",
    host="websocket.ressonance.com",
    port=443,
    ssl=True,
)


def _get_json_body(request):
    try:
        return json.loads(request.body.decode() or "{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}

def send_public_event(request):
    if request.method != "GET":
        return HttpResponse(status=405)

    pusher_client.trigger("public-channel", "new-release", {"release": "hello world"})
    return HttpResponse("Event sent!")


urlpatterns = [
    path("send-public-event", send_public_event),
]


if __name__ == "__main__":
    # Allow `python main.py` to behave like `manage.py runserver 0.0.0.0:5000`
    if len(sys.argv) == 1:
        sys.argv += ["runserver", "0.0.0.0:5000"]
    execute_from_command_line(sys.argv)
```
