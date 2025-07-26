package main

import (
	"fmt"
	
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Messages struct {
	Message []string `json:"messages"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"hello": "geet"})
	})

	r.POST("/", func(c *gin.Context) {
		fmt.Println("***********************************************************")
		fmt.Println("got message")
		// body, _ := io.ReadAll(c.Request.Body)
		// fmt.Println(string(body))

		fmt.Println("***********************************************************")
		var messages Messages

		if err := c.BindJSON(&messages); err != nil {
			c.JSON(http.StatusBadRequest,gin.H{"error":"bad request"})
			return
		}
		fmt.Println(messages.Message)
		c.JSON(http.StatusOK, gin.H{"message":"success"})

	})

	r.Run(":8080")
}
