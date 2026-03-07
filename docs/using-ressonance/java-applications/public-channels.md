---
sidebar_position: 1
slug: /using-ressonance/java/public-channels
title: Using public channels with Java
---

## Using public channels with Java

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

  @GetMapping("/send-public-event")
  public String sendPublicEvent() {
    pusher.trigger("public-channel", "new-release", Map.of("release", "hello world"));
    return "Event sent!";
  }

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
```
