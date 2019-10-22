package controller

import (
	"bytes"
	. "fox/http"
	"html/template"
	"log"
	"net/http"

	"github.com/labstack/echo"
)

// render html 输出
func render(ctx echo.Context, contentTpl string, data map[string]interface{}) error {
	return Render(ctx, contentTpl, data)
}

func renderError(ctx echo.Context, data map[string]interface{}) error {
	errorHtml := `<!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8">
	<title>Fox服务错误</title>
	<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<style>
		html,body{height:100%}
		body{margin:0;padding:0;width:100%;display:table;font-weight:100;font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif}
		.container{text-align:center;display:table-cell;vertical-align:middle}
		.content{border:1px solid #ebccd1;text-align:center;display:inline-block;background-color:#f2dede;color:#a94442;padding:30px}
		.title{font-size:18px}
		.copyright{margin-top:30px;text-align:right;color:#000}
	</style>
	</head>
	<body>
		<div class="container">
			<div class="content">
				<div class="title">
					{{.error_title}},错误详情:
					<br><strong>{{.error_description}}</strong>
				</div>
				<div class="copyright">Powered By github.com/zouhuigang/fox</div>
			</div>
		</div>
	</body>
	</html>`
	tpl, err := template.New("layout.html").Parse(errorHtml)
	if err != nil {
		log.Println("parseFiles error", err)
		return err
	}

	buf := new(bytes.Buffer)
	err = tpl.Execute(buf, data)
	if err != nil {
		log.Println("execute error", err)
		return err
	}
	return ctx.HTML(http.StatusOK, buf.String())
}
