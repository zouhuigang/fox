package server

import (
	"fox/config"
	"fox/http/controller"
	"fox/inits"

	"github.com/labstack/echo"
)

func Run(c config.Provider, listen string) error {
	//初始化参数
	inits.Init(c)

	//启动服务
	e := echo.New()
	e.HideBanner = true
	staticFile(e)

	frontG := e.Group("")
	controller.RegisterRoutes(frontG)
	// e.Logger.Fatal()
	return e.Start(listen)
}
