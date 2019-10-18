package config

import (
	"errors"
	"fox/util"
	"strings"

	"github.com/spf13/viper"
	"github.com/zouhuigang/package/zfile"
)

/*
加载用户自定义的config.toml
*/

var ErrNoConfigFile = errors.New("Unable to locate config file or config directory. Perhaps you need to create a new site.\n       Run `hugo help new` for details.\n")

//传值
type ConfigSourceDescriptor struct {

	// Path to the config file to use, e.g. /my/project/config.toml
	Filename string

	Path string
}

func (d ConfigSourceDescriptor) configFilenames() []string {
	if d.Filename == "" {
		return []string{"config"}
	}
	return strings.Split(d.Filename, ",")
}

func loadDefaultSettingsFor(v *viper.Viper) error {
	v.SetDefault("themesDir", "themes")
	return nil
}

type configLoader struct {
	ConfigSourceDescriptor
}

func (l configLoader) loadConfig(configName string, v *viper.Viper) (string, error) {

	var filename string
	if util.ExtNoDelimiter(configName) != "" {
		filename = configName
	} else {
		//循环配置后缀
		for _, ext := range ValidConfigFileExtensions {
			filenameToCheck := configName + "." + ext
			if zfile.IsFileExist(filenameToCheck) {
				filename = filenameToCheck
				break
			}
		}
	}

	if filename == "" {
		return "", ErrNoConfigFile
	}

	m, err := FromFileToMap(filename)
	if err != nil {
		return "", errors.New("FromFileToMap" + err.Error())
	}

	if err = v.MergeConfigMap(m); err != nil {
		return "", errors.New("MergeConfigMap" + err.Error())
	}

	return filename, nil

}
