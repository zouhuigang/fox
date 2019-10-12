package controller

import (
	"fmt"
	"fox/system"
	"io/ioutil"
	"path"
	"time"
	// "fmt"
	"fox/inits/parse"
	"fox/util"
	"html/template"
	"os"

	"github.com/labstack/echo"
	"github.com/microcosm-cc/bluemonday"
	"github.com/russross/blackfriday"
	"github.com/zouhuigang/package/zfile"
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
	g.GET("/", this.Editor)
	g.POST("/make/file", this.mk)
	g.POST("/markdown/info", this.mdInfo)
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
		cur_file.Name = cur_f.Name
		cur_file.Size = cur_f.Size
		cur_file.CreatedAt = time.Now()
		cur_file.ModTime = cur_f.ModTime
		cur_file.Icon = icon
		cur_file.SizeStr = sizeStr
		mFileList = append(mFileList, cur_file)

	}

	return nil, mFileList
}

func (MdController) Editor(ctx echo.Context) error {
	data := map[string]interface{}{}

	meta := make([]*TitleMeta, 0)
	// meta.Title="你好"
	m1 := new(TitleMeta)
	m1.Name = "aaa"
	meta = append(meta, m1)

	data["meta"] = meta
	data["flinks"] = "ass"

	var pages string = "markdown/editor.html"
	pages = fmt.Sprintf("%s,%s", pages, "common/template.html")
	pages = fmt.Sprintf("%s,%s", pages, "compoents/header.html")
	pages = fmt.Sprintf("%s,%s", pages, "compoents/leftNav.html")
	pages = fmt.Sprintf("%s,%s", pages, "compoents/body.html")
	pages = fmt.Sprintf("%s,%s", pages, "compoents/left2.html")
	pages = fmt.Sprintf("%s,%s", pages, "compoents/preview.html")
	pages = fmt.Sprintf("%s,%s", pages, "compoents/save.html")

	//读取本地文件
	_, fileList := scan(parse.EnvConfig.CmdRoot)
	data["fileList"] = fileList
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
