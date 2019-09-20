package main

import (
	_ "fox/inits"
	"fox/server"

	"github.com/labstack/echo"
)

func main() {
	e := echo.New()
	e.HideBanner = true
	server.Static(e)
	e.Start("localhost:8080")
}
