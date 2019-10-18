package cmd

/*
打印出所有的配置
*/
import (
	"fmt"
	"reflect"
	"regexp"
	"sort"
	"strings"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/zouhuigang/golog"
)

var _ cmder = (*configCmd)(nil)

type configCmd struct {
	foxBuilderCommon
	*baseCmd
}

func newConfigCmd() *configCmd {
	cc := &configCmd{}
	cc.baseCmd = newBaseCmd(&cobra.Command{
		Use:   "config",
		Short: "Print configuration",
		Long:  `Print configuration, both default and custom settings.`,
		RunE:  cc.printConfig,
	})

	return cc
}

func (c *configCmd) printConfig(cmd *cobra.Command, args []string) error {
	cfg, err := initializeConfig(true, false, &c.foxBuilderCommon, c, nil)
	if err != nil {
		return err
	}

	allSettings := cfg.Cfg.(*viper.Viper).AllSettings()

	// We need to clean up this, but we store objects in the config that
	// isn't really interesting to the end user, so filter these.
	ignoreKeysRe := regexp.MustCompile("client|sorted|filecacheconfigs|allmodules|multilingual")

	separator := ": "

	if len(cfg.configFiles) > 0 && strings.HasSuffix(cfg.configFiles[0], ".toml") {
		separator = " = "
	}

	var keys []string
	for k := range allSettings {
		if ignoreKeysRe.MatchString(k) {
			continue
		}
		keys = append(keys, k)
	}
	sort.Strings(keys)

	golog.SetTimeFormat("")

	for _, k := range keys {
		kv := reflect.ValueOf(allSettings[k])
		if kv.Kind() == reflect.String {
			lg := fmt.Sprintf("%s%s\"%+v\"\n", k, separator, allSettings[k])
			golog.Print(lg)
		} else {
			lg := fmt.Sprintf("%s%s%+v\n", k, separator, allSettings[k])
			golog.Print(lg)
		}
	}

	return nil
}
