package cmd

import (
	"fox/config"

	"github.com/spf13/cobra"
)

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

	//传新的配置
	doWithConfig := func(cfg config.Provider) error {

		if c.ftch != nil {
			// fmt.Printf("loadConfig\n")
			c.ftch.flagsToConfig(cfg)
		}

		cfg.Set("workingDir", "sss")
		cfg.Set("environment", "bbbb")
		return nil
	}

	//带回调函数
	doWithCommandeer := func(cfg config.Provider) error {
		c.Cfg = cfg
		if c.doWithCommandeer == nil {
			return nil
		}
		err := c.doWithCommandeer(c)
		return err
	}

	//写入配置
	config, err := config.LoadConfig(config.ConfigSourceDescriptor{Filename: c.h.cfgFile}, doWithCommandeer, doWithConfig)
	if err != nil {
		return err
	}

	config.Set("fox_env_test", "fox env test success")
	// s := config.GetString("fox_env_test")
	// fmt.Printf("=============%s\n", s)

	//加载用户自定义的配置文件
	// fmt.Println("加载用户自定义配置", c.h.cfgFile)
	return nil
}

func (c *commandeer) build() error {

	return nil
}
