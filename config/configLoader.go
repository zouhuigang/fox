package config

import (
	"fox/parser/maps"
	"fox/parser/metadecoders"

	"github.com/spf13/viper"
)

var keyAliases maps.KeyRenamer

func init() {
	var err error
	keyAliases, err = maps.NewKeyRenamer(
		// Before 0.53 we used singular for "menu".
		"{menu,languages/*/menu}", "menus",
	)

	if err != nil {
		panic(err)
	}
}

// FromConfigString creates a config from the given YAML, JSON or TOML config. This is useful in tests.
func FromConfigString(config, configType string) (Provider, error) {
	v := newViper()
	m, err := readConfig(metadecoders.FormatFromString(configType), []byte(config))
	if err != nil {
		return nil, err
	}

	v.MergeConfigMap(m)

	return v, nil
}

func readConfig(format metadecoders.Format, data []byte) (map[string]interface{}, error) {
	m, err := metadecoders.Default.UnmarshalToMap(data, format)
	if err != nil {
		return nil, err
	}

	RenameKeys(m)

	return m, nil

}

// func loadConfigFromFile(fs afero.Fs, filename string) (map[string]interface{}, error) {
// 	m, err := metadecoders.Default.UnmarshalFileToMap(fs, filename)
// 	if err != nil {
// 		return nil, err
// 	}
// 	RenameKeys(m)
// 	return m, nil
// }

func RenameKeys(m map[string]interface{}) {
	keyAliases.Rename(m)
}

func newViper() *viper.Viper {
	v := viper.New()

	return v
}
