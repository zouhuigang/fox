package parse

import (
	"io/ioutil"
	"os"
	"path"

	"github.com/BurntSushi/toml"
)

//主题
type Theme struct {
	Template *ThemeTemplate
}
type ThemeTemplate struct {
	Pages []string
}

var (
	ThemeConfig *Theme
)

func readConf(fname string) (p *Theme, err error) {
	var (
		fp       *os.File
		fcontent []byte
	)
	p = new(Theme)
	if fp, err = os.Open(fname); err != nil {
		return
	}

	if fcontent, err = ioutil.ReadAll(fp); err != nil {
		return
	}

	if err = toml.Unmarshal(fcontent, p); err != nil {
		return
	}
	return
}
func ThemeParse() {
	theme := path.Join(EnvConfig.ThemeDir, EnvConfig.Theme)
	rfile := path.Join(theme, "theme.toml")

	ThemeConfig, _ = readConf(rfile)
}
