package markdown

import (
	"fmt"
	"fox/config"
	"io/ioutil"
	"os"

	"github.com/zouhuigang/package/zfile"
)

//从文件读取配置
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
