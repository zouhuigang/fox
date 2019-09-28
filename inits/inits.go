package inits

import (
	"fmt"
	"fox/config"
	"fox/inits/parse"
)

func Init(c config.Provider) {
	fmt.Println("theme", c.GetString("theme"))
	parse.EnvParse()
}
