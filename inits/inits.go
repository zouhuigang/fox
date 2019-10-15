package inits

import (
	"fox/config"
	"fox/inits/parse"
)

func Init(c config.Provider, defaultTheme string) {
	// fmt.Println("theme", c.GetStringSlice("theme"))
	parse.EnvParse(c, defaultTheme)
	parse.ThemeParse()
}
