package config

import (
	"fmt"
	"path/filepath"

	"github.com/mitchellh/mapstructure"
	"github.com/spf13/viper"
)

//加载配置
func LoadConfig(d ConfigSourceDescriptor, doWithConfig ...func(cfg Provider) error) (*viper.Viper, error) {
	var v *viper.Viper = viper.New()

	//用户自定义配置文件
	var configFiles []string
	l := configLoader{ConfigSourceDescriptor: d}
	for _, name := range d.configFilenames() {
		var filename string
		filename, err := l.loadConfig(name, v)
		if err == nil {
			configFiles = append(configFiles, filename)
		} else if err != ErrNoConfigFile {
			return nil, err
		}
	}

	if err := loadDefaultSettingsFor(v); err != nil {
		return v, err
	}

	fmt.Println("configFiles:", configFiles)

	//系统的回调配置
	for _, d := range doWithConfig {
		if err := d(v); err != nil {
			return v, err
		}
	}

	return v, nil
}

//动态读取固定配置
var DefaultModuleConfig = Config{}

type Import struct {
	Path         string // Module path
	IgnoreConfig bool   // Ignore any config.toml found.
	Disable      bool   // Turn off this module.
	Mounts       []Mount
}

type Mount struct {
	Source string // relative path in source repo, e.g. "scss"
	Target string // relative target path, e.g. "assets/bootstrap/scss"

	Lang string // any language code associated with this mount.
}

type Config struct {
	Mounts  []Mount
	Imports []Import

	// Meta info about this module (license information etc.).
	Params map[string]interface{}

	// Configures GOPROXY.
	Proxy string
	// Configures GONOPROXY.
	NoProxy string
	// Configures GOPRIVATE.
	Private string
}

func DecodeConfig(cfg Provider) (Config, error) {
	c := DefaultModuleConfig

	if cfg == nil {
		return c, nil
	}

	themeSet := cfg.IsSet("theme")
	moduleSet := cfg.IsSet("module")

	if moduleSet {
		m := cfg.GetStringMap("module")
		if err := mapstructure.WeakDecode(m, &c); err != nil {
			return c, err
		}

		for i, mnt := range c.Mounts {
			mnt.Source = filepath.Clean(mnt.Source)
			mnt.Target = filepath.Clean(mnt.Target)
			c.Mounts[i] = mnt
		}

	}

	if themeSet {
		imports := GetStringSlicePreserveString(cfg, "theme")
		for _, imp := range imports {
			c.Imports = append(c.Imports, Import{
				Path: imp,
			})
		}

	}

	return c, nil
}
