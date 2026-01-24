---
sidebar_position: 5
slug: /using-ressonance/croadcast-with-private-channels
title: Brodcasting with private channels
---

## Broadcasting with Private Channels

To broadcast an event to specific authenticated users we can use Private Channels.

This is an simples example of an internal company communication.

Lets generate an event class:

```sh
php artisan make:event CommunicationSent
```

This will generate a class. Lets apply a some small changes the end class should be like this:

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommunicationSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(string $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private.communication'),
        ];
    }
}
```
The only difference at the backend class is the `PivateChannel` class, punlic broadcasting use `Illuminate\Broadcasting\Channel` instead


Now on the frontend lets add this code to your blade.


```html
<script>
    document.addEventListener("DOMContentLoaded", () => {
        Echo.private('private.communication')
            .listen('CommunicationSent', (e) => {
                alert('New Message from management: ' + e.message);
        });
    });
</script>
```

Now to trigger this we can execute:

```php
App\Events\CommunicationSent::dispatch("The company is adopting the 4 days week!!! Enjoy!!!")
```

And see this message at the browser:

------- image

Same here about the `private` method, public listeners use `channel` instead. This is the only diference in the code between both broadcasting methods but to use private broadcasting you should be logged in.

This is an easy example. To understand completly what you can do and all features of groadcasting take a looke at the Laravel Documentation.