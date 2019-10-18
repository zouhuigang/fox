package cmd

import (
	"github.com/spf13/cobra"
)

func (b *commandsBuilder) newBuilderCmd(cmd *cobra.Command) *baseBuilderCmd {
	bcmd := &baseBuilderCmd{commandsBuilder: b, baseCmd: &baseCmd{command: cmd}}

	//通用的命令处理
	bcmd.foxBuilderCommon.handleFlags(cmd)
	return bcmd
}

func newCommandsBuilder() *commandsBuilder {
	return &commandsBuilder{}
}

func addCommands(root *cobra.Command, commands ...cmder) {
	for _, command := range commands {
		cmd := command.getCommand()
		if cmd == nil {
			continue
		}
		root.AddCommand(cmd)
	}
}

func (b *commandsBuilder) addAll() *commandsBuilder {
	b.addCommands(
		b.newWikiCmd(),
		b.newGitBookCmd(),
		newConfigCmd(),
		newVersionCmd(),
		newEnvCmd(),
	)

	return b
}
func (b *commandsBuilder) addCommands(commands ...cmder) *commandsBuilder {
	b.commands = append(b.commands, commands...)
	return b
}

//获取所有的cmd，然后注入到主的cmd中
func (b *commandsBuilder) build() *foxCmd {
	h := b.newFoxCmd()
	addCommands(h.getCommand(), b.commands...)
	return h
}
