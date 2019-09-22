package cmd
import 
("github.com/spf13/cobra"
"fox/config"
)
type baseCmd struct {
	command *cobra.Command
}


func newBaseCmd(cmd *cobra.Command) *baseCmd {
	return &baseCmd{command: cmd}
}

func (c *baseCmd) getCommand() *cobra.Command {
	return c.command
}
func (c *baseCmd) flagsToConfig(cfg config.Provider) {
	initializeFlags(c.command, cfg)
}