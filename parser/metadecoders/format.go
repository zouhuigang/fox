package metadecoders

import (
	"path/filepath"
	"strings"

	"fox/parser/pageparser"
)

type Format string

const (
	// These are the supported metdata  formats in Hugo. Most of these are also
	// supported as /data formats.
	ORG  Format = "org"
	JSON Format = "json"
	TOML Format = "toml"
	YAML Format = "yaml"
	CSV  Format = "csv"
)

// FormatFromString turns formatStr, typically a file extension without any ".",
// into a Format. It returns an empty string for unknown formats.
func FormatFromString(formatStr string) Format {
	formatStr = strings.ToLower(formatStr)
	if strings.Contains(formatStr, ".") {
		// Assume a filename
		formatStr = strings.TrimPrefix(filepath.Ext(formatStr), ".")

	}
	switch formatStr {
	case "yaml", "yml":
		return YAML
	case "json":
		return JSON
	case "toml":
		return TOML
	case "org":
		return ORG
	case "csv":
		return CSV
	}

	return ""

}

// FormatFromFrontMatterType will return empty if not supported.
func FormatFromFrontMatterType(typ pageparser.ItemType) Format {
	switch typ {
	case pageparser.TypeFrontMatterJSON:
		return JSON
	case pageparser.TypeFrontMatterORG:
		return ORG
	case pageparser.TypeFrontMatterTOML:
		return TOML
	case pageparser.TypeFrontMatterYAML:
		return YAML
	default:
		return ""
	}
}

// FormatFromContentString tries to detect the format (JSON, YAML or TOML)
// in the given string.
// It return an empty string if no format could be detected.
func (d Decoder) FormatFromContentString(data string) Format {
	csvIdx := strings.IndexRune(data, d.Delimiter)
	jsonIdx := strings.Index(data, "{")
	yamlIdx := strings.Index(data, ":")
	tomlIdx := strings.Index(data, "=")

	if isLowerIndexThan(csvIdx, jsonIdx, yamlIdx, tomlIdx) {
		return CSV
	}

	if isLowerIndexThan(jsonIdx, yamlIdx, tomlIdx) {
		return JSON
	}

	if isLowerIndexThan(yamlIdx, tomlIdx) {
		return YAML
	}

	if tomlIdx != -1 {
		return TOML
	}

	return ""
}

func isLowerIndexThan(first int, others ...int) bool {
	if first == -1 {
		return false
	}
	for _, other := range others {
		if other != -1 && other < first {
			return false
		}
	}

	return true
}
