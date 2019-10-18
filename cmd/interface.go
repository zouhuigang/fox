package cmd

import (
	"fox/config"

	"github.com/spf13/cobra"
)

//interface
//每个命令行继承的方法
type cmder interface {
	flagsToConfigHandler
	getCommand() *cobra.Command
}

//将命令行参数写入配置中
type flagsToConfigHandler interface {
	flagsToConfig(cfg config.Provider)
}

//struct
type baseBuilderCmd struct {
	*baseCmd
	*commandsBuilder
}
type commandsBuilder struct {
	foxBuilderCommon
	commands []cmder
}

type baseCmd struct {
	command *cobra.Command
}
type foxBuilderCommon struct {
	source      string
	baseURL     string
	environment string
	cfgFile     string //用户自定义配置文件
	cfgDir      string //用户自定义配置文件目录
}

type commandeer struct {
	h                *foxBuilderCommon
	ftch             flagsToConfigHandler
	configFiles      []string
	doWithCommandeer func(c *commandeer) error

	serverPorts []int
	configured  bool
	Cfg         config.Provider `json:"-"`
	// Any error from the last build.
	buildErr error
}
