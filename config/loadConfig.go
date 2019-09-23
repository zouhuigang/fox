package config

import (
	"github.com/spf13/viper"
)

/*
加载配置
*/

func LoadConfig(doWithConfig ...func(cfg Provider) error) (*viper.Viper, error) {
	v := viper.New()

	for _, d := range doWithConfig {
		if err := d(v); err != nil {
			return v, err
		}
	}

	return v, nil
}
