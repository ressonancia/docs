---
sidebar_position: 2
slug: /using-ressonance/dotnet/private-channels
title: Using private channels with .NET
---

## Using private channels with .NET

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
                    endpoint: "http://localhost:5000/authorize"
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
dotnet add package PusherServer
```
This is a small .NET example application.

```javascript
using PusherServer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();
app.UseCors();

var pusher = new Pusher(
    "RESSONANCE_APP_ID",
    "RESSONANCE_APP_KEY",
    "RESSONANCE_APP_SECRET",
    new PusherOptions
    {
        Host = "websocket.ressonance.com",
        Encrypted = true
    }
);

app.MapPost("/authorize", async (HttpRequest request) =>
{
    var form = await request.ReadFormAsync();
    var socketId = form["socket_id"].ToString();
    var channelName = form["channel_name"].ToString();
    var authResponse = pusher.Authenticate(channelName, socketId);
    return Results.Json(authResponse);
});

app.MapGet("/send-private-event", async () =>
{
    await pusher.TriggerAsync("private-channel", "new-order", new { order = "New Samsung Galaxy Sold" });
    return Results.Text("Private Event sent!");
});

app.Run("http://0.0.0.0:5000");
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
