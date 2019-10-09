package cmd

import (
	"fmt"
	"fox/config"
	"strings"

	"github.com/spf13/cobra"
	flag "github.com/spf13/pflag"
	"github.com/zouhuigang/golog"
)

type Response struct {
	Err     error
	Command *cobra.Command
}

//启动所有服务
func Execute(args []string) Response {
	foxCmd := newCommandsBuilder().addAll().build()
	m_cmd := foxCmd.getCommand()
	m_cmd.SetArgs(args)

	c, err := m_cmd.ExecuteC()

	var resp Response
	resp.Err = err
	resp.Command = c

	return resp
}

//挂载配置
func initializeConfig(mustHaveConfigFile, running bool, h *foxBuilderCommon, f flagsToConfigHandler, doWithCommandeer func(c *commandeer) error) (*commandeer, error) {
	// fmt.Println("initializeConfig\n")
	c, err := newCommandeer(mustHaveConfigFile, running, h, f, doWithCommandeer)
	if err != nil {
		golog.Error("initializeConfig" + err.Error())
		return nil, err
	}

	return c, nil

}

//保存全局的值
func initializeFlags(cmd *cobra.Command, cfg config.Provider) {
	//fmt.Println("initializeFlags\n")
	//golog.Info("initializeFlags")
	persFlagKeys := []string{
		"debug",
		"verbose",
		"logFile",
	}

	flagKeys := []string{
		"baseURL",
		"buildWatch",
		"cfgFile",
		"source",
		"layoutDir",
		"theme",
		"themesDir",
		"fox_env_test",
	}

	// Will set a value even if it is the default.
	flagKeysForced := []string{
		"minify",
	}

	for _, key := range persFlagKeys {
		setValueFromFlag(cmd.PersistentFlags(), key, cfg, "", false)
	}
	for _, key := range flagKeys {
		setValueFromFlag(cmd.Flags(), key, cfg, "", false)
	}

	for _, key := range flagKeysForced {
		setValueFromFlag(cmd.Flags(), key, cfg, "", true)
	}
	// Set some "config aliases"
	//setValueFromFlag(cmd.Flags(), "destination", cfg, "publishDir", false)
	//setValueFromFlag(cmd.Flags(), "i18n-warnings", cfg, "logI18nWarnings", false)
	//setValueFromFlag(cmd.Flags(), "path-warnings", cfg, "logPathWarnings", false)

}

func setValueFromFlag(flags *flag.FlagSet, key string, cfg config.Provider, targetKey string, force bool) {
	key = strings.TrimSpace(key)
	if (force && flags.Lookup(key) != nil) || flags.Changed(key) {
		f := flags.Lookup(key)
		configKey := key
		if targetKey != "" {
			configKey = targetKey
		}
		// Gotta love this API.
		switch f.Value.Type() {
		case "bool":
			bv, _ := flags.GetBool(key)
			cfg.Set(configKey, bv)
		case "string":
			cfg.Set(configKey, f.Value.String())
		case "stringSlice":
			bv, _ := flags.GetStringSlice(key)
			cfg.Set(configKey, bv)
			//fmt.Printf("flags key:%s type:%s value:%s\n", key, f.Value.Type(), bv)
		case "int":
			iv, _ := flags.GetInt(key)
			cfg.Set(configKey, iv)
		default:
			panic(fmt.Sprintf("update switch with %s", f.Value.Type()))
		}

	}

	// // s := cfg.GetString("fox_env_test")
	// s := cfg.GetString(key)
	// fmt.Printf("====%s==%s=\n", key, s)
}
