package main

import (
	"fox/cmd"
	"os"

)



func main() {

	resp := cmd.Execute(os.Args[1:])

	if resp.Err != nil {
			resp.Command.Println(resp.Command.UsageString())
	
		os.Exit(-1)
	}

}
