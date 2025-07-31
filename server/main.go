package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gocolly/colly/v2"
)

// Profile holds the scraped LinkedIn profile data
type Profile struct {
	Name        string `json:"name,omitempty"`
	Headline    string `json:"headline,omitempty"`
	Location    string `json:"location,omitempty"`
	Connections string `json:"connections,omitempty"`
}

// scrapeLinkedInProfile scrapes the public LinkedIn profile data
func scrapeLinkedInProfile(url string) (*Profile, error) {
	profile := &Profile{}

	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"),
		colly.AllowedDomains("www.linkedin.com", "linkedin.com"),
	)
	c.SetRequestTimeout(15 * time.Second)

	// Profile name
	c.OnHTML("h1", func(e *colly.HTMLElement) {
		profile.Name = strings.TrimSpace(e.Text)
	})

	// Headline
	c.OnHTML(".text-body-medium.break-words", func(e *colly.HTMLElement) {
		profile.Headline = strings.TrimSpace(e.Text)
	})

	// Location
	c.OnHTML(".text-body-small.inline.break-words", func(e *colly.HTMLElement) {
		profile.Location = strings.TrimSpace(e.Text)
	})

	// Connections
	c.OnHTML(".pv-top-card--list-bullet li", func(e *colly.HTMLElement) {
		if strings.Contains(e.Text, "connections") {
			profile.Connections = strings.TrimSpace(e.Text)
		}
	})

	// Log errors
	c.OnError(func(r *colly.Response, err error) {
		log.Printf("Scrape error: %s — %s", r.Request.URL, err)
	})

	err := c.Visit(url)
	if err != nil {
		return nil, err
	}

	return profile, nil
}

func main() {
	router := gin.Default()

	// Configure CORS (change domain for production)
	corsConfig := cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}
	router.Use(cors.New(corsConfig))

	// Health check
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "LinkedIn Scraper is running"})
	})

	// Scrape endpoint
	router.GET("/scrape", func(c *gin.Context) {
		url := c.Query("url")

		// Validate URL
		if url == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'url' query parameter"})
			return
		}
		if !strings.HasPrefix(url, "https://www.linkedin.com/in/") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Only public LinkedIn profile URLs are allowed"})
			return
		}

		// Scrape
		profile, err := scrapeLinkedInProfile(url)
		if err != nil {
			log.Println("Failed to scrape:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scrape LinkedIn profile"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data":   profile,
		})
	})

	// Start server
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
