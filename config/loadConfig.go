package config

import (
	"github.com/spf13/viper"
)

func LoadConfig(doWithConfig ...func(cfg Provider) error) (*viper.Viper, error) {
	var v *viper.Viper = viper.New()

	for _, d := range doWithConfig {
		if err := d(v); err != nil {
			return v, err
		}
	}

	return v, nil
}
