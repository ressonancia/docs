---
sidebar_position: 2
slug: /using-ressonance/symfony/private-channels
title: Using private channels with Symfony
---

## Using private channels with Symfony

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
This is a small Symfony example application.

```javascript
<?php

namespace App\Controller;

use Pusher\Pusher;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/authorize', methods: ['POST'])]
    public function authorize(Request $request): Response
    {
        $socketId = $request->request->get('socket_id');
        $channelName = $request->request->get('channel_name');
        $authResponse = $this->pusher->authorizeChannel($channelName, $socketId);

        return new Response($authResponse, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/send-private-event', methods: ['GET'])]
    public function sendPrivateEvent(): Response
    {
        $this->pusher->trigger('private-channel', 'new-order', ['order' => 'New Samsung Galaxy Sold']);
        return new Response('Private Event sent!');
    }
}
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
