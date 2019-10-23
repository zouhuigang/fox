package parse

import (
	"io/ioutil"
	"os"
	"path"

	"github.com/BurntSushi/toml"
)

//主题
type Theme struct {
	Plugins       *Plugins
	PluginsConfig *PluginsConfig
}
type Plugins struct {
	Modules []string
}

type PluginsConfig struct {
	Pages   *M_pages
	Summary *M_summary
}

//模块配置
type M_pages struct {
	Pages []string
}

type M_summary struct {
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
