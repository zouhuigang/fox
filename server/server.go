package server

import(
	"fox/http/controller"
	"fox/inits"
	
	
	"github.com/labstack/echo"
)

func Run(listen string){
	//初始化参数
	inits.Init()
	
	//启动服务
	e := echo.New()
	e.HideBanner = true
	staticFile(e)

	frontG := e.Group("")
	controller.RegisterRoutes(frontG)
	e.Logger.Fatal(e.Start(listen))
}