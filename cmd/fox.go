package cmd

import (
	"fox/config"

	"github.com/spf13/cobra"
)

type foxCmd struct {
	*baseBuilderCmd
	// Need to get the sites once built.
	c *commandeer
}

func (b *commandsBuilder) newFoxCmd() *foxCmd {
	cc := &foxCmd{}

	cc.baseBuilderCmd = b.newBuilderCmd(&cobra.Command{
		Use:   "fox",
		Short: "fox builds your site",
		Long:  `fox is the main command...`,
		RunE: func(cmd *cobra.Command, args []string) error {
			cfgInit := func(c *commandeer) error {

				c.Set("disableLiveReload", true)
				return nil
			}

			//挂载配置
			c, err := initializeConfig(true, false, &cc.foxBuilderCommon, cc, cfgInit)
			if err != nil {
				return err
			}
			cc.c = c
			return c.build()
		},
	})

	//cc.cmd.PersistentFlags().BoolVar(&cc.quiet, "quiet", false, "build in quiet mode")
	//用户自定义配置
	cc.command.PersistentFlags().StringVar(&cc.cfgFile, "config", "", "config file (default is path/config.yaml|json|toml)")
	// Set bash-completion
	_ = cc.command.PersistentFlags().SetAnnotation("config", cobra.BashCompFilenameExt, config.ValidConfigFileExtensions)

	return cc
}
