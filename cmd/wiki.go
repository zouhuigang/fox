package cmd

import (
	"fox/server"
	"strconv"
	"net"
	"github.com/spf13/cobra"
)

type wikiCmd struct {
	*baseBuilderCmd             //继承基础cmd
	stop            <-chan bool //停止
	port            int         //端口
	bind            string      //绑定服务
}

func (this *commandsBuilder) newWikiCmd() *wikiCmd {
	return this.newWikiCmdSignaled(nil)
}

func (this *commandsBuilder) newWikiCmdSignaled(stop <-chan bool) *wikiCmd {
	wiki := &wikiCmd{stop: stop}

	wiki.baseBuilderCmd = this.newBuilderCmd(&cobra.Command{
		Use:     "wiki",
		Aliases: []string{"wk"},
		Short:   "wiki server",
		Long:    `github wiki localhoust server.`,
		RunE:    wiki.server,
	})

	wiki.command.Flags().IntVarP(&wiki.port, "port", "p", 8080, "port on which the server will listen")
	wiki.command.Flags().StringVarP(&wiki.bind, "bind", "", "127.0.0.1", "interface to which the server will bind")
	return wiki
}

func (wk *wikiCmd) server(cmd *cobra.Command, args []string) error {
	// destination, _ := cmd.Flags().GetString("destination")
	server.Run(net.JoinHostPort(wk.bind, strconv.Itoa(wk.port)))
	return nil
}
