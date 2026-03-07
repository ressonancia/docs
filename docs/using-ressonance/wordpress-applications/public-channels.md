---
sidebar_position: 1
slug: /using-ressonance/wordpress/public-channels
title: Using public channels with WordPress
---

## Using public channels with WordPress

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
    register_rest_route('ressonance/v1', '/send-public-event', [
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => function () {
            ressonance_get_pusher_client()->trigger(
                'public-channel',
                'new-release',
                ['release' => 'hello world']
            );

            return new WP_REST_Response(['message' => 'Event sent!'], 200);
        },
    ]);
});
```
