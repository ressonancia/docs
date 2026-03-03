---
sidebar_position: 2
slug: /using-ressonance/java/private-channels
title: Using private channels with Java
---

## Using private channels with Java

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
                    endpoint: "http://localhost:8080/authorize"
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
mvn dependency:get -Dartifact=com.pusher:pusher-http-java:1.4.0
```
This is a small Java example application.

```javascript
import com.pusher.rest.Pusher;
import com.pusher.rest.PusherOptions;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
public class Application {

  private final Pusher pusher;

  public Application() {
    PusherOptions options = new PusherOptions()
      .setHost("websocket.ressonance.com")
      .setUseTLS(true);

    this.pusher = new Pusher("RESSONANCE_APP_ID", "RESSONANCE_APP_KEY", "RESSONANCE_APP_SECRET", options);
  }

  @PostMapping("/authorize")
  public String authorize(
      @RequestParam("socket_id") String socketId,
      @RequestParam("channel_name") String channelName
  ) {
    return pusher.authenticate(channelName, socketId);
  }

  @GetMapping("/send-private-event")
  public String sendPrivateEvent() {
    pusher.trigger("private-channel", "new-order", Map.of("order", "New Samsung Galaxy Sold"));
    return "Private Event sent!";
  }

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
