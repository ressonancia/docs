---
sidebar_position: 2
slug: /using-ressonance/golang/private-channels
title: Using private channels with Golang
---

## Using private channels with Golang

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
go get github.com/pusher/pusher-http-go/v5
```
This is a small Golang example application.

```go
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"

	pusher "github.com/pusher/pusher-http-go/v5"
)

func withCors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func main() {
	client := pusher.Client{
		AppID:  "RESSONANCE_APP_ID",
		Key:    "RESSONANCE_APP_KEY",
		Secret: "RESSONANCE_APP_SECRET",
		Host:   "websocket.ressonance.com",
		Secure: true,
	}

	http.HandleFunc("/authorize", withCors(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if err := r.ParseForm(); err != nil {
			http.Error(w, "Invalid payload.", http.StatusBadRequest)
			return
		}

		socketID := r.FormValue("socket_id")
		channelName := r.FormValue("channel_name")

		stringToSign := socketID + ":" + channelName
		mac := hmac.New(sha256.New, []byte("RESSONANCE_APP_SECRET"))
		mac.Write([]byte(stringToSign))
		signature := hex.EncodeToString(mac.Sum(nil))

		authResponse := map[string]string{
			"auth": "RESSONANCE_APP_KEY:" + signature,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(authResponse)
	}))

	http.HandleFunc("/send-private-event", withCors(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		err := client.Trigger("private-channel", "new-order", map[string]string{"order": "New Samsung Galaxy Sold"})
		if err != nil {
			http.Error(w, "Failed to send event.", http.StatusInternalServerError)
			return
		}

		w.Write([]byte("Private Event sent!"))
	}))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

**IMPORTANT: When you try to subscribe to a private channel, the client library will try to authorize the channel. The authorization route (`/authorize`) needs a real authorization workflow that validates the user and all relevant rules. This is only a dummy example.**
