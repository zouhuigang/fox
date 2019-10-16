package controller

import (
	"fmt"
	"fox/system"
	"io/ioutil"
	"path"
	"path/filepath"
	"time"
	// "fmt"
	"fox/inits/parse"
	"fox/util"
	"html/template"
	"io"
	"os"
	"strings"

	"fox/model/markdown"

	"github.com/labstack/echo"
	"github.com/microcosm-cc/bluemonday"
	"github.com/russross/blackfriday"
	"github.com/zouhuigang/package/zfile"
	"github.com/zouhuigang/package/ztime"
)

type MdController struct{}
type ConfigsMeta struct {
	Id       int    `json:"id"`
	MetaType string `json:"meta_type"`
	Name     string `json:"name"`
	Content  string `json:"content"`
}

type TitleMeta struct {
	Title       string `json:"title"`
	ConfigsMeta `xorm:"extends"`
}

//注册路由
func (this *MdController) RegisterRoute(g *echo.Group) {
	g.GET("/", this.pageHandle)
	g.GET("/*.html", this.pageHandle)
	g.POST("/make/file", this.mk)
	g.POST("/markdown/info", this.mdInfo)
	g.POST("/markdown/save", this.mdSave)
	g.POST("/markdown/delete", this.mdDelete)
	g.POST("/markdown/rename", this.mdRename)
}

//文件列表
type File_list struct {
	ID        int64 `json:"-"` // xorm默认自动递增
	Eid       string
	IsDir     bool   //是否是目录
	Dir       string `xorm:"varchar(500)"` //绝对目录
	Path      string `xorm:"varchar(500)"`
	Ext       string `xorm:"varchar(50)"`  //后缀
	Name      string `xorm:"varchar(200)"` //名称
	Icon      string `xorm:"varchar(20)"`  //图标
	Size      int64
	SizeStr   string    `xorm:"varchar(20)"`
	CreatedAt time.Time `xorm:"created"`
	ModTime   int64     `xorm:"updated"`
}

func scan(rootPath string) (error, []*File_list) { //扫描文件
	err := zfile.PathExistsAndMkDir(rootPath)
	if err != nil {
		return err, nil
	}

	err, filelist := util.Walkdir(rootPath)
	if err != nil {
		return err, nil
	}

	//排除目录
	mFileList := make([]*File_list, 0)
	for _, cur_f := range filelist {
		var icon string = ""
		//排除不是word的文档
		if cur_f.Ext == ".md" {
			icon = "icon-md"
		} else {
			continue
		}

		//if folder := dest + filepath.Dir(f.Name); !strings.Contains(folder, "__MACOSX") {}

		sizeStr := zfile.FormatByte(zfile.Interface2Int(cur_f.Size))
		cur_file := &File_list{}
		cur_file.IsDir = cur_f.IsDir
		cur_file.Dir = cur_f.Dir
		cur_file.Path = cur_f.Path
		cur_file.Ext = cur_f.Ext
		cur_file.Name = strings.TrimSuffix(cur_f.Name, cur_f.Ext)
		cur_file.Size = cur_f.Size
		cur_file.CreatedAt = time.Now()
		cur_file.ModTime = cur_f.ModTime
		cur_file.Icon = icon
		cur_file.SizeStr = sizeStr
		mFileList = append(mFileList, cur_file)

	}

	return nil, mFileList
}

type mdInfo struct {
	Html       template.HTML
	Md         string
	Size       int64
	SizeStr    string
	ModTime    int64
	ModTimeStr string
}

//读取markdown文件信息
func (this *MdController) readMarkdown(fileName string) (error, *mdInfo) {
	md := new(mdInfo)

	//检测文件是否存在
	if zfile.IsFileExist(fileName) {
		//f, err = ioutil.ReadFile(fileName)
		// if err != nil {
		// 	return err, output, f
		// }

		fi, err := os.Open(fileName)
		if err != nil {
			return err, md
		}
		defer fi.Close()

		f, err := ioutil.ReadAll(fi)
		if err != nil {
			return err, md
		}

		unsafe := blackfriday.MarkdownCommon(f)
		outputHtml := bluemonday.UGCPolicy().SanitizeBytes(unsafe)
		md.Html = template.HTML(outputHtml)
		md.Md = string(f)

		//获取文件信息
		// Size:    info.Size(),
		// ModTime: info.ModTime().Unix(),
		if finfo, err := fi.Stat(); err == nil {
			md.Size = finfo.Size()
			md.ModTime = finfo.ModTime().Unix()
			md.ModTimeStr = ztime.DateInt64("Y-m-d H:i:s", md.ModTime)
			md.SizeStr = util.FormatSize(md.Size)
		}

	}
	return nil, md
}

func (this *MdController) pageHandle(ctx echo.Context) error {
	data := map[string]interface{}{}

	//路由逻辑
	mUrlpath := ctx.Request().URL.Path[1:]
	// fmt.Println("====", mUrlpath)

	mMarkdown := new(mdInfo)
	if util.IsHtmlFile(mUrlpath) {
		fileName := path.Join(parse.EnvConfig.CmdRoot, strings.TrimSuffix(mUrlpath, ".html"))
		err, rmd := this.readMarkdown(fileName + ".md")
		if err == nil {
			mMarkdown = rmd
		}
	}

	//读取自定义配置数据
	cfgFile := path.Join(parse.EnvConfig.CmdRoot, "fox.toml")
	markdown.LoadConfigFromFile(cfgFile)

	meta := make([]*TitleMeta, 0)
	m1 := new(TitleMeta)
	m1.Name = "aaa"
	meta = append(meta, m1)

	data["meta"] = meta
	data["flinks"] = "ass"

	//页面
	var pages string
	for index, page := range parse.ThemeConfig.Template.Pages {
		if index == 0 {
			pages = fmt.Sprintf("%s", page)
		} else {
			pages = fmt.Sprintf("%s,%s", pages, page)
		}
	}

	//读取本地文件
	_, fileList := scan(parse.EnvConfig.CmdRoot)
	data["fileList"] = fileList
	data["markdown"] = mMarkdown
	//data["cfg"]=cfg
	return render(ctx, pages, data)

}

func (MdController) mdInfo(ctx echo.Context) error {
	data := map[string]interface{}{}
	fileName := ctx.FormValue("fileName")

	if fileName == "" {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件路径不能为空")
	}

	//检测文件是否存在
	if !zfile.IsFileExist(fileName) {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件不存在")
	}

	//读取文件内容
	f, err := ioutil.ReadFile(fileName)
	if err != nil {
		return system.ResponeJson(ctx, system.ErrUnknown, data, err.Error())
	}

	// content := template.HTML(blackfriday.Run(f))

	var output template.HTML
	unsafe := blackfriday.MarkdownCommon(f)
	outputHtml := bluemonday.UGCPolicy().SanitizeBytes(unsafe)
	output = template.HTML(outputHtml)

	data["output"] = output
	data["info"] = string(f)
	return system.ResponeJson(ctx, system.ErrOk, data)
}

//创建本地文件
func (this *MdController) mk(ctx echo.Context) error {
	data := map[string]interface{}{}

	//fileName := ctx.QueryParam("fileName")
	fileName := ctx.FormValue("fileName")

	if fileName == "" {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件名不能为空")
	}

	rfile := path.Join(parse.EnvConfig.CmdRoot, fileName+".md")

	//检测文件是否存在
	if zfile.IsFileExist(rfile) {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件已存在")
	}

	f, err := os.Create(rfile)
	defer f.Close()
	if err != nil {
		return system.ResponeJson(ctx, system.ErrUnknown, data)
	}
	_, err = f.Write([]byte("Hello,fox..."))
	if err != nil {
		return system.ResponeJson(ctx, system.ErrUnknown, data)
	}

	return system.ResponeJson(ctx, system.ErrOk, data)
}

/*
const (
        O_RDONLY int = syscall.O_RDONLY // 只读打开文件和os.Open()同义
        O_WRONLY int = syscall.O_WRONLY // 只写打开文件
        O_RDWR   int = syscall.O_RDWR   // 读写方式打开文件
        O_APPEND int = syscall.O_APPEND // 当写的时候使用追加模式到文件末尾
        O_CREATE int = syscall.O_CREAT  // 如果文件不存在，此案创建
        O_EXCL   int = syscall.O_EXCL   // 和O_CREATE一起使用, 只有当文件不存在时才创建
        O_SYNC   int = syscall.O_SYNC   // 以同步I/O方式打开文件，直接写入硬盘.
        O_TRUNC  int = syscall.O_TRUNC  // 如果可以的话，当打开文件时先清空文件
)
*/
//写入内容
func (MdController) mdSave(ctx echo.Context) error {
	data := map[string]interface{}{}
	fileName := ctx.FormValue("fileName")
	content := ctx.FormValue("content")

	if fileName == "" {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件路径不能为空")
	}

	//检测文件是否存在
	if !zfile.IsFileExist(fileName) {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件不存在")
	}

	f, err := os.OpenFile(fileName, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0666) //打开文件
	if err != nil {
		return system.ResponeJson(ctx, system.ErrUnknown, data, err.Error())
	}

	defer f.Close()

	//写入文件
	n, err := io.WriteString(f, content)
	if err != nil {
		return system.ResponeJson(ctx, system.ErrUnknown, data, err.Error())
	}

	data["n"] = n //字节数
	return system.ResponeJson(ctx, system.ErrOk, data)
}

//删除文件
func (MdController) mdDelete(ctx echo.Context) error {
	data := map[string]interface{}{}
	fileName := ctx.FormValue("fileName")

	if fileName == "" {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件路径不能为空")
	}

	//检测文件是否存在
	if !zfile.IsFileExist(fileName) {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件不存在")
	}

	//写入文件
	err := os.Remove(fileName)
	if err != nil {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件删除失败"+err.Error())
	}
	return system.ResponeJson(ctx, system.ErrOk, data)
}

//重命名
func (MdController) mdRename(ctx echo.Context) error {
	data := map[string]interface{}{}
	fileName := ctx.FormValue("fileName")
	newName := ctx.FormValue("newName")

	if fileName == "" {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件路径不能为空")
	}

	//检测文件是否存在
	if !zfile.IsFileExist(fileName) {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件不存在")
	}

	if newName == "" {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "新文件名不能为空")
	}

	mFilePath := filepath.Dir(fileName)
	newFileName := path.Join(mFilePath, newName+".md")

	//写入文件
	err := os.Rename(fileName, newFileName)
	if err != nil {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件重命名失败"+err.Error())
	}
	return system.ResponeJson(ctx, system.ErrOk, data)
}
