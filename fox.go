package main

import (
	"flag"
	"fox/server"
	"os"
)

var (
	serverType = flag.String("type", "help", "help ?")
	listen     = flag.String("listen", "localhost:8080", "listen address")
	// port       = flag.String("port", "8080", "HTTP port number")
)

func init() {
	flag.Usage = func() {
		help()
	}
}

func help() {
	os.Stderr.WriteString(`fox help` + "\n")
	flag.PrintDefaults()
}

func main() {

	flag.Parse()

	if flag.Arg(0) == "wiki" {
		server.Run(*listen)
	} else {
		help()
	}

}
