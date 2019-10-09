package inits

import (
	"fox/config"
	"fox/inits/parse"
)

func Init(c config.Provider) {
	// fmt.Println("theme", c.GetStringSlice("theme"))
	parse.EnvParse(c)
}
