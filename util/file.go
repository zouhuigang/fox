package util

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"github.com/zouhuigang/package/zfileutil"
)

// 检查文件或目录是否存在
// 如果由 filename 指定的文件或目录存在则返回 true，否则返回 false
func Exist(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil || os.IsExist(err)
}

// 列出指定路径中的文件和目录
// 如果目录不存在，则返回空slice
func ScanDir(directory string) []string {
	file, err := os.Open(directory)
	if err != nil {
		return []string{}
	}
	names, err := file.Readdirnames(-1)
	if err != nil {
		return []string{}
	}
	return names
}

// 判断给定文件名是否是一个目录
// 如果文件名存在并且为目录则返回 true。如果 filename 是一个相对路径，则按照当前工作目录检查其相对路径。
func IsDir(filename string) bool {
	return isFileOrDir(filename, true)
}

// 判断给定文件名是否为一个正常的文件
// 如果文件存在且为正常的文件则返回 true
func IsFile(filename string) bool {
	return isFileOrDir(filename, false)
}

// 判断是文件还是目录，根据decideDir为true表示判断是否为目录；否则判断是否为文件
func isFileOrDir(filename string, decideDir bool) bool {
	fileInfo, err := os.Stat(filename)
	if err != nil {
		return false
	}
	isDir := fileInfo.IsDir()
	if decideDir {
		return isDir
	}
	return !isDir
}

//获取当前执行的路径
func GetCurrentDirectory() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0])) //返回绝对路径  filepath.Dir(os.Args[0])去除最后一个元素的路径
	if err != nil {
		log.Fatal(err)
	}
	return strings.Replace(dir, "\\", "/", -1) //将\替换成/
}

func Walkdir(path string) (error, []zfileutil.FileList) {
	var wg sync.WaitGroup

	//读取文件
	var filelist []zfileutil.FileList
	c := make(chan []zfileutil.FileList)
	is_success := make(chan bool)

	dir, err := ioutil.ReadDir(path)
	if err != nil {
		return err, nil
	}
	for _, fi := range dir {
		fpath := filepath.FromSlash(path + "/" + fi.Name())

		if fi.IsDir() {
			if strings.HasPrefix(fi.Name(), ".") {
				continue
			}
			if strings.HasPrefix(fi.Name(), "..") {
				continue
			}
			if strings.Contains(fi.Name(), "lost+found") {
				continue
			}

			if strings.Contains(fi.Name(), "fox.theme") {
				continue
			}
			wg.Add(1)
			go scanDir(&wg, fpath, c)
		} else {
			cur_file := zfileutil.GetFormatFileInfo(fpath, fi)
			filelist = append(filelist, cur_file)
		}
	}

	//一直阻塞直到chan c关闭
	go func() {
		for {
			select {
			case result := <-c:
				filelist = append(filelist, result...)
			case <-is_success:
				return
			}
		}
	}()

	wg.Wait()

	is_success <- true
	return nil, filelist

}

func scanDir(wg *sync.WaitGroup, rootPath string, c chan []zfileutil.FileList) {
	defer wg.Done()
	filelist := make([]zfileutil.FileList, 0)
	if f, _ := zfileutil.ScanFiles(rootPath); len(f) > 0 {
		filelist = append(filelist, f...)
	}
	c <- filelist
}
