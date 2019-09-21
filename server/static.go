package server

import (

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)
type staticRootConf struct {
	root   string
	isFile bool
}

var staticFileMap = map[string]staticRootConf{
	"/static/":     {"static", false},
	"/favicon.ico": {"static/favicon.ico", true},
	"/sitemap/":    {"sitemap", false},
	"/upload":      {"upload", false},
}

var filterPrefixs = make([]string, 0, 3)

func staticFile(e *echo.Echo) {
	//e.File("/favicon.ico", "static/favicon.ico")
	for prefix, rootConf := range staticFileMap {
		filterPrefixs = append(filterPrefixs, prefix)

		rfile:=rootConf.root
		if rootConf.isFile {
			e.File(prefix, rfile)
		} else {
			e.Group(prefix, middleware.StaticWithConfig(middleware.StaticConfig{
				Skipper: middleware.DefaultSkipper,
				Root:    rfile,
				Index:   "index.html",
				HTML5:   true,
				Browse:  false, //true在浏览器中浏览文件目录
			}))
		}
	}
}
