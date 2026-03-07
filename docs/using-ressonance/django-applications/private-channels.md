---
sidebar_position: 2
slug: /using-ressonance/django/private-channels
title: Using private channels with Django
---

## Using private channels with Django

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


@csrf_exempt
def authenticate(request):
    if request.method != "POST":
        return HttpResponse(status=405)

    payload = _get_json_body(request)
    socket_id = request.POST.get("socket_id") or payload.get("socket_id")

    if not socket_id:
        return JsonResponse({"error": "socket_id is required"}, status=400)

    # Replace this with real user lookup
    user = {
        "id": "some_id",
        "user_info": {"name": "John Smith"},
        "watchlist": ["another_id_1", "another_id_2"],
    }

    auth_response = pusher_client.authenticate_user(socket_id, user)
    return JsonResponse(auth_response)


@csrf_exempt
def authorize(request):
    if request.method != "POST":
        return HttpResponse(status=405)

    payload = _get_json_body(request)
    socket_id = request.POST.get("socket_id") or payload.get("socket_id")
    channel = request.POST.get("channel_name") or payload.get("channel_name")

    if not socket_id or not channel:
        return JsonResponse(
            {"error": "socket_id and channel_name are required"}, status=400
        )

    # This authenticates every user. Don't do this in production!
    auth_response = pusher_client.authenticate(channel, socket_id)
    return JsonResponse(auth_response)

def send_private_event(request):
    if request.method != "GET":
        return HttpResponse(status=405)

    pusher_client.trigger(
        "private-channel", "new-order", {"order": "New Samsung Galaxy Sold"}
    )
    return HttpResponse("Private Event sent!")


urlpatterns = [
    path("authenticate", authenticate),
    path("authorize", authorize),
    path("send-private-event", send_private_event),
]


if __name__ == "__main__":
    # Allow `python main.py` to behave like `manage.py runserver 0.0.0.0:5000`
    if len(sys.argv) == 1:
        sys.argv += ["runserver", "0.0.0.0:5000"]
    execute_from_command_line(sys.argv)

```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
