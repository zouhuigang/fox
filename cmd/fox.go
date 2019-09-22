package cmd

import "github.com/spf13/cobra"

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
			return nil
		},
	})

	//cc.cmd.PersistentFlags().BoolVar(&cc.quiet, "quiet", false, "build in quiet mode")

	return cc
}
