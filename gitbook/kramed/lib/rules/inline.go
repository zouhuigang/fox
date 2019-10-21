package rules

import (
	"github.com/dlclark/regexp2"
)

var Link = regexp2.MustCompile(`^!?\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)`, 0)
