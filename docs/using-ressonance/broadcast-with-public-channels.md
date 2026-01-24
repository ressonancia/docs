---
sidebar_position: 4
slug: /using-ressonance/croadcast-with-public-channels
title: Brodcasting with public channels
---

## Broadcasting with Public Channels

We can dispatch events from the backend to the frontend publically. Lets take an example of a new product on Sale and we want to notify every user at the website.

Lets generate an event class:

```sh
php artisan make:event NewProductOnSaleReleased
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

class NewProductOnSaleReleased implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $productName;

    /**
     * Create a new event instance.
     */
    public function __construct(string $productName)
    {
        $this->productName = $productName;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('product.on.sale'),
        ];
    }
}
```

Now on the frontend lets add this code to your blade.


```html
<script>
    document.addEventListener("DOMContentLoaded", () => {
        Echo.channel('product.on.sale')
            .listen('NewProductOnSaleReleased', (e) => {
                alert('New Product On Sale!!!');
        });
    });
</script>
```

Now to trigger this we can execute:

```php
App\Events\NewProductOnSaleReleased::dispatch("New Ressonance Sale. If you see this message send a print to support@ressonance.com and you have 3 months for free.")
```

And see this message at the browser:

------- image

This is an easy example. To understand completly what you can do and all features of groadcasting take a looke at the Laravel Documentation.

The next tutorial will show you a simples Private Channel.