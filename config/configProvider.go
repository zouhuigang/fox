package config

import (
	"github.com/spf13/cast"
)

type Provider interface {
	GetString(key string) string
	GetInt(key string) int
	GetBool(key string) bool
	GetStringMap(key string) map[string]interface{}
	GetStringMapString(key string) map[string]string
	GetStringSlice(key string) []string
	Get(key string) interface{}
	Set(key string, value interface{})
	IsSet(key string) bool
}

func GetStringSlicePreserveString(cfg Provider, key string) []string {
	sd := cfg.Get(key)
	return toStringSlicePreserveString(sd)
}

func toStringSlicePreserveString(v interface{}) []string {
	if sds, ok := v.(string); ok {
		return []string{sds}
	}
	return cast.ToStringSlice(v)
}
func SetBaseTestDefaults(cfg Provider) {
	cfg.Set("resourceDir", "resources")
	cfg.Set("contentDir", "content")
	cfg.Set("dataDir", "data")
	cfg.Set("i18nDir", "i18n")
	cfg.Set("layoutDir", "layouts")
	cfg.Set("assetDir", "assets")
	cfg.Set("archetypeDir", "archetypes")
	cfg.Set("publishDir", "public")
}
