package cmd

import (
	"fox/server"
	"net"
	"strconv"

	"github.com/spf13/cobra"
)

const m_GitBook string = "gitbook" //需要传给后面，当做默认主题

type gitBookCmd struct {
	*baseBuilderCmd             //继承基础cmd
	stop            <-chan bool //停止
	port            int         //端口
	bind            string      //绑定服务
}

func (this *commandsBuilder) newGitBookCmd() *gitBookCmd {
	return this.newGitBookCmdSignaled(nil)
}

func (this *commandsBuilder) newGitBookCmdSignaled(stop <-chan bool) *gitBookCmd {
	book := &gitBookCmd{stop: stop}

	book.baseBuilderCmd = this.newBuilderCmd(&cobra.Command{
		Use:     m_GitBook,
		Aliases: []string{"gbk"},
		Short:   "gitbook server",
		Long:    `git book localhost server.`,
		RunE:    book.server,
	})

	book.command.Flags().IntVarP(&book.port, "port", "p", 8081, "port on which the server will listen")
	book.command.Flags().StringVarP(&book.bind, "bind", "", "127.0.0.1", "interface to which the server will bind")
	return book
}

func (gbk *gitBookCmd) server(cmd *cobra.Command, args []string) error {
	// destination, _ := cmd.Flags().GetString("destination")

	//.Cfg.GetString("publishDir")
	//挂载配置
	//c, err := initializeConfig(true, true, &sc.hugoBuilderCommon, sc, cfgInit)

	cfgInit := func(c *commandeer) error {
		c.Set("token", "foxToken")
		return nil
	}

	c, err := initializeConfig(true, false, &gbk.foxBuilderCommon, gbk, cfgInit)
	if err != nil {
		return err
	}

	return server.Run(c.Cfg, net.JoinHostPort(gbk.bind, strconv.Itoa(gbk.port)), m_GitBook)
}
