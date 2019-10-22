package markdown

import (
	"errors"
	"fmt"
	"fox/config"
	gitbookParsers "fox/gitbook/gitbook-parsers/lib"
	"io/ioutil"
	"os"

	"github.com/zouhuigang/package/zfile"
)

//从文件读取配置,未使用
func LoadConfigFromFile(fileName string) error {

	if zfile.IsFileExist(fileName) {

		fi, err := os.Open(fileName)
		if err != nil {
			// fmt.Println("=========0=============", err.Error())
			return err
		}
		defer fi.Close()

		f, err := ioutil.ReadAll(fi)
		if err != nil {
			// fmt.Println("=========1=============", err.Error())
			return err
		}

		tomlConfig := string(f)
		cp, err := config.FromConfigString(tomlConfig, "toml")
		if err != nil {
			// fmt.Println("=========2=============", err.Error())
			return err
		}
		modCfg, _ := config.DecodeConfig(cp)
		fmt.Println("=========modCfg=============", modCfg)
	}

	return nil

}

type GitBookSystem struct {
	Summary string //目录路径

}

//解析目录
/*
1、解析markdown为(对应gitbook插件:gitbook-markdown,https://github.com/GitbookIO/gitbook-markdown)
2、解析目录(https://github.com/GitbookIO/gitbook-parsers)

*/
func ParseSummary(fileName string) (error, []*gitbookParsers.NSummary) {
	if !zfile.IsFileExist(fileName) {
		return errors.New("文件不存在:" + fileName), nil

	}

	fi, err := os.Open(fileName)
	if err != nil {
		return err, nil
	}
	defer fi.Close()

	f, err := ioutil.ReadAll(fi)
	if err != nil {
		return err, nil
	}

	return nil, gitbookParsers.NormalizeSummary(string(f), nil)
}
