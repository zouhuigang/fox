package cmd

import (
	"fox/config"

	"github.com/spf13/cobra"
)

type commandeer struct {
	h                *foxBuilderCommon
	ftch             flagsToConfigHandler
	configFiles      []string
	doWithCommandeer func(c *commandeer) error

	serverPorts []int
	configured  bool
	Cfg config.Provider `json:"-"`
	// Any error from the last build.
	buildErr error
}

func newCommandeer(mustHaveConfigFile, running bool, h *foxBuilderCommon, f flagsToConfigHandler, doWithCommandeer func(c *commandeer) error, subCmdVs ...*cobra.Command) (*commandeer, error) {

	c := &commandeer{
		h:                h,
		ftch:             f,
		doWithCommandeer: doWithCommandeer,
	}

	return c, c.loadConfig(mustHaveConfigFile, running)
}

func (c *commandeer) Set(key string, value interface{}) {
	if c.configured {
		panic("commandeer cannot be changed")
	}
	c.Cfg.Set(key, value)
}

func (c *commandeer) loadConfig(mustHaveConfigFile, running bool) error {

	// doWithConfig := func(cfg config.Provider) error {

	// 	if c.ftch != nil {
	// 		c.ftch.flagsToConfig(cfg)
	// 	}

	// 	cfg.Set("workingDir", dir)
	// 	cfg.Set("environment", environment)
	// 	return nil
	// }
	return nil
}
