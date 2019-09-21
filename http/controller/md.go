package controller

import (
	"fox/system"
	// "fmt"
	// "html/template"
	"fox/inits/parse"
	"log"
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
	g.GET("/editor", this.Editor)
	g.GET("/make/file", this.mk)
	// g.GET("/vm/:id", this.View)
}

func (MdController) Editor(ctx echo.Context) error {
	data := map[string]interface{}{}

	//来源论坛
	kw := ctx.QueryParam("kw")
	log.Println(kw)

	data["kw"] = kw
	// mp3, _ := model.MdModelMp3List(10)
	// data["mp3"] = mp3
	// if model.Publics.IsMobile(ctx) {
	// 	return render(ctx, "markdown/m-editor.html,common/template.html", data)
	// } else {
	// 	return render(ctx, "markdown/editor.html,common/template.html", data)
	// }

	meta := make([]*TitleMeta, 0)
	// meta.Title="你好"
	m1 := new(TitleMeta)
	m1.Name = "aaa"
	meta = append(meta, m1)

	data["meta"] = meta
	data["flinks"] = "ass"

	return render(ctx, "markdown/editor.html,common/template.html", data)

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

	f, err := os.Create(parse.EnvConfig.Root + fileName+".md")
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
