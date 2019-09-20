package server

import (
	"fox/inits/parse"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type staticRootConf struct {
	root   string
	isFile bool
}

var staticFileMap = map[string]staticRootConf{
	"/static/":     {"/static", false},
	"/favicon.ico": {"/static/favicon.ico", true},
	"/sitemap/":    {"/sitemap", false},
	"/upload":      {"/upload", false},
}

var filterPrefixs = make([]string, 0, 3)

func Static(e *echo.Echo) {
	for prefix, rootConf := range staticFileMap {
		filterPrefixs = append(filterPrefixs, prefix)

		if rootConf.isFile {
			e.File(prefix, parse.EnvConfig.Root+rootConf.root)
		} else {
			e.Group(prefix, middleware.StaticWithConfig(middleware.StaticConfig{
				Skipper: middleware.DefaultSkipper,
				Root:    parse.EnvConfig.Root + rootConf.root,
				Index:   "index.html",
				HTML5:   true,
				Browse:  false, //true在浏览器中浏览文件目录
			}))
		}
	}
}
