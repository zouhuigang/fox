package modules

import (
	"fmt"
	"fox/inits/parse"
	"strings"
)

//数据配置
type Modules struct {
	Err  error
	Data interface
	Name string
}

//加载模块
func LoadModules() []*Modules {
	pluginsList := parse.ThemeConfig.Plugins
	modulesList := make([]*Modules, 0)
	for _, plugin := range pluginsList {
		modules := new(Modules)
		if strings.ToUpper(plugin) == "PAGES" {
			//页面
			var pages string
			for index, page := range parse.ThemeConfig.PluginsConfig.Pages.Pages {
				if index == 0 {
					pages = fmt.Sprintf("%s", page)
				} else {
					pages = fmt.Sprintf("%s,%s", pages, page)
				}
			}
			modules.Name="PAGES"
			modules.Err=nil
			modules.Data=pages
			modulesList=append(modulesList,modules)
		}

	}

	return modulesList
}
