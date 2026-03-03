---
sidebar_position: 1
slug: /using-ressonance/dotnet/public-channels
title: Using public channels with .NET
---

## Using public channels with .NET

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

app.MapGet("/send-public-event", async () =>
{
    await pusher.TriggerAsync("public-channel", "new-release", new { release = "hello world" });
    return Results.Text("Event sent!");
});

app.Run("http://0.0.0.0:5000");
```
