package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gocolly/colly/v2"
)

type Message struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

type Messages struct {
	Message []Message `json:"messages"`
}

// Profile holds the scraped data from a LinkedIn profile.

type Profile struct {
	Name        string `json:"name"`
	Headline    string `json:"headline"`
	Location    string `json:"location"`
	Connections string `json:"connections"`
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

	r.GET("/scrape", func(c *gin.Context) {
		linkedInURL := c.Query("url")
		if linkedInURL == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "url query parameter is required"})
			return
		}

		collector := colly.NewCollector(
			colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"),
		)

		var profile Profile

		collector.OnHTML("h1", func(e *colly.HTMLElement) {
			profile.Name = e.Text
		})

		collector.OnHTML(".text-body-medium.break-words", func(e *colly.HTMLElement) {
			profile.Headline = e.Text
		})

		collector.OnHTML(".text-body-small.inline.break-words", func(e *colly.HTMLElement) {
			profile.Location = e.Text
		})

		collector.OnError(func(r *colly.Response, err error) {
			log.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scrape the page."})
		})

		collector.OnRequest(func(r *colly.Request) {
			fmt.Println("Visiting", r.URL.String())
		})

		err := collector.Visit(linkedInURL)
		if err != nil {
			log.Println("Error visiting page:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to visit the page."})
			return
		}

		c.JSON(http.StatusOK, profile)
	})

	r.Run(":8080")
}
