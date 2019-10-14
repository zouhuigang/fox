package parse

import (
	"fmt"
	"fox/config"
	"fox/inits/bindata/conf"
	"fox/util"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strings"

	"github.com/zouhuigang/golog"
	"gopkg.in/yaml.v2"
	// "fox/config"
)

const (
	// http://patorjk.com/software/taag/#p=display&f=Small%20Slant&t=Echo
	banner = `
     ________   _______  ____       ___
    / ______  /       /      \     /
   / ______  /       /        \  /
  /         /       /          \ 
 /         /	   /	      / \
/         /_______/     _____/	 \_____
____________________________________O/_______
                                    O\
`
	mTheme = `fox.theme`
)

type MyEnv struct {
	Root     string          //程序执行路径
	CmdRoot  string          //命令行执行路径
	CmdCfg   config.Provider //命令行输入的命令
	ThemeDir string          //主题目录
	Theme    string          //主题
	Env      struct {
		Weburl      string `yaml:"weburl"`
		TemplateDir string `yaml:"template_dir"`
		Version     string `yaml:"version"`
		Github      string `yaml:"github"`
	}
}

var (
	EnvConfig MyEnv
)

// fileExist 检查文件或目录是否存在
// 如果由 filename 指定的文件或目录存在则返回 true，否则返回 false
func fileExist(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil || os.IsExist(err)
}

//https://blog.csdn.net/ytd7777/article/details/90517422
func EnvParse(cmdCfg config.Provider) {
	envData, err := conf.Asset("conf/env.yml")
	if err != nil {
		golog.Fatalf("Error. %s", err)
	}

	if err = yaml.Unmarshal(envData, &EnvConfig); err != nil {
		golog.Fatalf("Error. %s", err)
	}

	//golog.Info(string(envData))
	//ROOT
	//获取exe执行路径
	curFilename := os.Args[0]
	binaryPath, err := exec.LookPath(curFilename)
	if err != nil {
		golog.Fatalf("binary path error. %s", err)
	}

	binaryPath, err = filepath.Abs(binaryPath)
	if err != nil {
		golog.Fatalf("binary abs path error. %s", err)
	}
	EnvConfig.Root = filepath.Dir(binaryPath) + "/"
	//sql模板路径
	envConFile := EnvConfig.Root + "conf/env.yml"
	if !fileExist(envConFile) {
		curDir, _ := os.Getwd()
		pos := strings.LastIndex(curDir, "src")
		if pos == -1 {
			golog.Fatalf("can't find  error. %s", envConFile)
		}

		EnvConfig.Root = curDir[:pos]
	}

	EnvConfig.CmdRoot = util.GetCurrentDirectory()

	//读取cmd
	EnvConfig.CmdCfg = cmdCfg
	themeList := cmdCfg.GetStringSlice("theme")
	if len(themeList) > 0 {
		EnvConfig.Theme = themeList[0]
	} else {
		EnvConfig.Theme = "wiki"
	}

	//局部主题是否存在
	mLocalTheme := path.Join(EnvConfig.CmdRoot, mTheme)
	mGlobalTheme := path.Join(EnvConfig.Root, mTheme)
	if fileExist(path.Join(mLocalTheme, EnvConfig.Theme)) {
		EnvConfig.ThemeDir = mLocalTheme + "/"
	} else if fileExist(path.Join(mGlobalTheme, EnvConfig.Theme)) {
		EnvConfig.ThemeDir = mGlobalTheme + "/"
	}

	fmt.Printf("%s%s\n", banner, EnvConfig.Env.Github)
	golog.Info("Root path:" + EnvConfig.Root)
	golog.Info("CmdRoot path:" + EnvConfig.CmdRoot)
	golog.Info("theme dir:" + EnvConfig.ThemeDir)
	golog.Info("version:" + EnvConfig.Env.Version)

}
