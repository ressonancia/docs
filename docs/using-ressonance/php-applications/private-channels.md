---
sidebar_position: 2
slug: /using-ressonance/php/private-channels
title: Using private channels with PHP
---

## Using private channels with PHP

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
composer require pusher/pusher-php-server
```
This is a small PHP example application.

```javascript
<?php

require __DIR__ . '/vendor/autoload.php';

$pusher = new Pusher\Pusher(
    'RESSONANCE_APP_KEY',
    'RESSONANCE_APP_SECRET',
    'RESSONANCE_APP_ID',
    [
        'host' => 'websocket.ressonance.com',
        'port' => 443,
        'scheme' => 'https',
        'useTLS' => true,
    ]
);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/authorize') {
    $socketId = $_POST['socket_id'] ?? '';
    $channelName = $_POST['channel_name'] ?? '';
    $authResponse = $pusher->authorizeChannel($channelName, $socketId);

    header('Content-Type: application/json');
    echo $authResponse;
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/send-private-event') {
    $pusher->trigger('private-channel', 'new-order', ['order' => 'New Samsung Galaxy Sold']);
    echo 'Private Event sent!';
    exit;
}

http_response_code(404);
echo 'Not found.';
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
