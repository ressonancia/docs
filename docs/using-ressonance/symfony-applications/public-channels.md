---
sidebar_position: 1
slug: /using-ressonance/symfony/public-channels
title: Using public channels with Symfony
---

## Using public channels with Symfony

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
This is a small Symfony example application.

```javascript
<?php

namespace App\Controller;

use Pusher\Pusher;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RealtimeController extends AbstractController
{
    private Pusher $pusher;

    public function __construct()
    {
        $this->pusher = new Pusher(
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

    #[Route('/send-public-event', methods: ['GET'])]
    public function sendPublicEvent(): Response
    {
        $this->pusher->trigger('public-channel', 'new-release', ['release' => 'hello world']);
        return new Response('Event sent!');
    }
}
```
