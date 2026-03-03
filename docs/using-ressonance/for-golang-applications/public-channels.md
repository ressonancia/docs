---
sidebar_position: 1
slug: /using-ressonance/golang/public-channels
title: Using public channels with Golang
---

## Using public channels with Golang

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
go get github.com/pusher/pusher-http-go/v5
```
This is a small Golang example application.

```go
package main

import (
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

	http.HandleFunc("/send-public-event", withCors(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		err := client.Trigger("public-channel", "new-release", map[string]string{"release": "hello world"})
		if err != nil {
			http.Error(w, "Failed to send event.", http.StatusInternalServerError)
			return
		}

		w.Write([]byte("Event sent!"))
	}))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
```
