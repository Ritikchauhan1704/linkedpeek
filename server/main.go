package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Message struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

type Messages struct {
	Message []Message `json:"messages"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"hello": "geet"})
	})

	r.POST("/", func(c *gin.Context) {
		var messages Messages

		if err := c.BindJSON(&messages); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
			return
		}

		fmt.Println("Received messages:", messages.Message)

		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "messages received",
		})
	})

	r.Run(":8080")
}
