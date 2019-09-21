package controller

import (

	"github.com/labstack/echo"
)

func RegisterRoutes(g *echo.Group) {

	new(MdController).RegisterRoute(g)

}

