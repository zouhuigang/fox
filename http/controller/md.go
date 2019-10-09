package controller

import (
	"fmt"
	"fox/system"
	// "fmt"
	// "html/template"
	"fox/inits/parse"
	"os"

	"github.com/labstack/echo"
	// "github.com/microcosm-cc/bluemonday"
	// "github.com/russross/blackfriday"
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
	g.GET("/make/file", this.mk)
	// g.GET("/vm/:id", this.View)
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
	return render(ctx, pages, data)

}

// func (MdController) View(ctx echo.Context) error {
// 	data := map[string]interface{}{}
// 	data, is_open := model.Welcome.CommonHeaderFooter(ctx, 12)
// 	if !is_open { //停机维护中。。
// 		return render(ctx, "welcome/repairs.html", data)
// 	}
// 	md, err := model.MdModelFindById(ctx, string(ctx.Param("id")))
// 	if err != nil {
// 		return render(ctx, "markdown/no-view.html,common/template.html", data)
// 	}

// 	if md.Is_open == 0 {
// 		return render(ctx, "markdown/no-view.html,common/template.html", data)
// 	}

// 	//解密笔记
// 	session1 := model.Session.GetCookieSession(ctx, "MDDCLS")
// 	sharePassword, _ := session1.Values["MDDCL"]
// 	if md.Is_open == 2 && md.Password_code != sharePassword {
// 		data["id"] = md.Id
// 		return render(ctx, "markdown/pass-view.html,common/template.html", data)
// 	}
// 	var output template.HTML
// 	if md.Is_html == 0 {
// 		unsafe := blackfriday.MarkdownCommon([]byte(md.Content))
// 		outputHtml := bluemonday.UGCPolicy().SanitizeBytes(unsafe)
// 		output = template.HTML(outputHtml)
// 	} else {
// 		output = template.HTML(md.Content)
// 	}

// 	bgMp3, _ := model.MdModelMp3ById(md.Bg_mp3)
// 	data["output"] = output
// 	data["info"] = md
// 	data["bgMp3"] = bgMp3
// 	return render(ctx, "markdown/view.html,common/template.html", data)
// }

//创建本地文件
func (this *MdController) mk(ctx echo.Context) error {
	data := map[string]interface{}{}

	fileName := ctx.QueryParam("fileName")

	if fileName == "" {
		return system.ResponeJson(ctx, system.ErrUnknown, data, "文件名不能为空")
	}

	f, err := os.Create(parse.EnvConfig.Root + fileName + ".md")
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
