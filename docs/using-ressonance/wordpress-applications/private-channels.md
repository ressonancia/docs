---
sidebar_position: 2
slug: /using-ressonance/wordpress/private-channels
title: Using private channels with WordPress
---

## Using private channels with WordPress

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
                    endpoint: "https://your.appdomain.example/wp-json/ressonance/v1/authorize"
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
This is a small WordPress example application.

```php
<?php
// File wp-content/themes/your-theme/functions.php

use Pusher\Pusher;

function ressonance_get_pusher_client() {
    static $pusher = null;

    if ($pusher === null) {
        $pusher = new Pusher(
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
    }

    return $pusher;
}

add_action('rest_api_init', function () {
    register_rest_route('ressonance/v1', '/authorize', [
        'methods' => 'POST',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
        'callback' => function (WP_REST_Request $request) {
            $socketId = $request->get_param('socket_id');
            $channelName = $request->get_param('channel_name');

            if (!$socketId || !$channelName) {
                return new WP_Error(
                    'invalid_payload',
                    'socket_id and channel_name are required',
                    ['status' => 400]
                );
            }

            $authResponse = ressonance_get_pusher_client()->authorizeChannel($channelName, $socketId);
            return rest_ensure_response(json_decode($authResponse, true));
        },
    ]);

    register_rest_route('ressonance/v1', '/send-private-event', [
        'methods' => 'POST',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
        'callback' => function () {
            ressonance_get_pusher_client()->trigger(
                'private-channel',
                'new-order',
                ['order' => 'New Samsung Galaxy Sold']
            );

            return new WP_REST_Response(['message' => 'Private Event sent!'], 200);
        },
    ]);
});
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
