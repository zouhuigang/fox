package http

import (

	"bytes"
	"fmt"

	"github.com/labstack/echo"
	"html" //解析mysql中的特殊字符
	"html/template"
	"log"
	"net/http"
"fox/util"
	"fox/inits/parse"
	
	"github.com/zouhuigang/golog"
	"github.com/zouhuigang/package/ztime"
	// "github.com/zouhuigang/php"
	//"strconv"
	"strings"
	"time"
)

func Request(ctx echo.Context) *http.Request {
	//return ctx.Request().(*standard.Request).Request
	return ctx.Request()
}

func ResponseWriter(ctx echo.Context) http.ResponseWriter {
	//return ctx.Response().(*standard.Response).ResponseWriter
	return ctx.Response()
}

// func in_array(val interface{}, array interface{}) bool {
// 	b, _ := php.In_array(val, array)
// 	return b
// }

// //如果condition为空字符,则返回trueVal,否则返回falseVal
// func php_if(condition string, trueVal, falseVal interface{}) interface{} {
// 	//b1, _ := strconv.ParseBool(condition) //将字符串转换成bool
// 	var b1 bool
// 	if condition != "" {
// 		b1 = true
// 	} else {
// 		b1 = false
// 	}
// 	b := php.If(b1, trueVal, falseVal).(string)
// 	return b
// }

// 自定义模板函数
var funcMap = template.FuncMap{
	// 获取gravatar头像
	"gravatar": util.Gravatar,
	// 转为前端显示需要的时间格式
	"formatTime": func(i interface{}) string {
		ctime, ok := i.(string)
		if !ok {
			return ""
		}
		t, _ := time.Parse("2006-01-02 15:04:05", ctime)
		return t.Format(time.RFC3339) + "+08:00"
	},
	"substring": util.Substring,
	"add": func(nums ...interface{}) int {
		total := 0
		for _, num := range nums {
			if n, ok := num.(int); ok {
				total += n
			}
		}
		return total
	},
	"minus": func(total int, nums ...interface{}) int {
		for _, num := range nums {
			if n, ok := num.(int); ok {
				total -= n
			}
		}
		return total
	},
	"explode": func(s, sep string) []string {
		return strings.Split(s, sep)
	},
	"noescape": func(s string) template.HTML {
		return template.HTML(s)
	},
	"html": func(s string) template.HTML {
		return template.HTML(s)
	},
	"UnescapeString": func(s string) string {
		return html.UnescapeString(s)
	},
	//解析mysql中的模板变量{{.kw}}
	"mysqlhtml": func(tpl string, data map[string]interface{}) string {
		t, _ := template.New("mysqlhtml").Parse(tpl)
		buf := new(bytes.Buffer)
		t.Execute(buf, data)
		return buf.String()
	},
	"timestamp": func(ts ...time.Time) int64 {
		if len(ts) > 0 {
			return ts[0].Unix()
		}
		return time.Now().Unix()
	},
	"nowtime": func() string {
		timestamp := ztime.NowTimeStamp()
		s3 := ztime.DateInt64("Y-m-d H:i:s", timestamp) //中国时间，东八区时间
		return s3
	},
	"week": func(timestamp int64) string {
		s2 := ztime.DateInt64("Y-m-d", timestamp)
		y, m, d := ztime.SliptDate(s2)
		ys, ms, ds := fmt.Sprintf("%d", y), fmt.Sprintf("%d", m), fmt.Sprintf("%d", d)
		w2 := ztime.GetWeekday(ys, ms, ds)
		week := fmt.Sprintf("周%s", w2)
		return week
	},
	"date": func(t time.Time) string {
		return t.Format("2006-01-02 15:04:05")
	},
	"mod": func(num, modnum int) int {
		return num % modnum
	},
	// "in_array": in_array,
	// "php_if":   php_if, //三元运算符
	"in_map": func(v string, data map[interface{}]interface{}) bool { //判断值在map中
		for _, v1 := range data {
			if v1 == v {
				return true
			}
		}
		return false
	},
	"pingjie": func(s1, s2, p string) string {
		return s1 + p + s2
	},
	"dateInt64": func(format string, timestamp int64) string { // format Y-m-d H:i:s
		dateString := ztime.DateInt64(format, timestamp) //中国时间，东八区时间
		return dateString
	},
	"isNullSetDefault": func(s interface{}, def string) string {
		if s == nil {
			return def
		}
		s1 := s.(string)
		if s1 == "" {
			return def
		}
		return s1
	},
}

const (
	LayoutTpl      = "common/layout.html"
	AdminLayoutTpl = "common.html"
)

// Render html 输出
func Render(ctx echo.Context, contentTpl string, data map[string]interface{}) error {
	if data == nil {
		data = map[string]interface{}{}
	}


	//contentTpl = LayoutTpl + "," + contentTpl
	// 为了使用自定义的模板函数，首先New一个以第一个模板文件名为模板名。
	// 这样，在ParseFiles时，新返回的*Template便还是原来的模板实例
	htmlFiles := strings.Split(contentTpl, ",")
	for i, contentTpl := range htmlFiles {
		htmlFiles[i] = parse.EnvConfig.Env.TemplateDir + contentTpl
	}

	FirstTpl := htmlFiles[0]
	FirstNewFileArr := strings.SplitAfter(FirstTpl, "/")
	lenN := len(FirstNewFileArr)
	FirstNewFile := FirstNewFileArr[lenN-1]
	//fmt.Println(FirstNewFile)
	tpl, err := template.New(FirstNewFile).Funcs(funcMap).ParseFiles(htmlFiles...)
	if err != nil {
		golog.Errorf("解析模板出错（ParseFiles）：[%q] %s\n", Request(ctx).RequestURI, err)
		return err
	}

	return executeTpl(ctx, tpl, data)
}

// RenderAdmin html 输出
func RenderAdmin(ctx echo.Context, contentTpl string, data map[string]interface{}) error {
	if data == nil {
		data = map[string]interface{}{}
	}

	//	objLog := model.GetLogger(ctx)

	contentTpl = AdminLayoutTpl + "," + contentTpl
	// 为了使用自定义的模板函数，首先New一个以第一个模板文件名为模板名。
	// 这样，在ParseFiles时，新返回的*Template便还是原来的模板实例
	htmlFiles := strings.Split(contentTpl, ",")
	for i, contentTpl := range htmlFiles {
		htmlFiles[i] = parse.EnvConfig.Env.TemplateDir + "admin/" + contentTpl
	}

	requestURI := Request(ctx).RequestURI
	tpl, err := template.New("common.html").Funcs(funcMap).ParseFiles(htmlFiles...)
	if err != nil {
		//objLog.Errorf("解析模板出错（ParseFiles）：[%q] %s\n", requestURI, err)
		panic(requestURI)
		return err
	}

	return executeTpl(ctx, tpl, data)
}

// 后台 query 查询返回结果
func RenderQuery(ctx echo.Context, contentTpl string, data map[string]interface{}) error {
	//objLog := model.GetLogger(ctx)

	contentTpl = "common_query.html," + contentTpl
	contentTpls := strings.Split(contentTpl, ",")
	for i, contentTpl := range contentTpls {
		contentTpls[i] = parse.EnvConfig.Env.TemplateDir + "admin/" + strings.TrimSpace(contentTpl)
	}

	requestURI := Request(ctx).RequestURI
	tpl, err := template.New("common_query.html").Funcs(funcMap).ParseFiles(contentTpls...)
	if err != nil {
		//objLog.Errorf("解析模板出错（ParseFiles）：[%q] %s\n", requestURI, err)
		panic(requestURI)
		return err
	}

	buf := new(bytes.Buffer)
	err = tpl.Execute(buf, data)
	if err != nil {
		//objLog.Errorf("执行模板出错（Execute）：[%q] %s\n", requestURI, err)
		return err
	}

	return ctx.HTML(http.StatusOK, buf.String())
}

func executeTpl(ctx echo.Context, tpl *template.Template, data map[string]interface{}) error {
	//objLog := model.GetLogger(ctx)

	// 如果没有定义css和js模板，则定义之
	if jsTpl := tpl.Lookup("js"); jsTpl == nil {
		tpl.Parse(`{{define "js"}}{{end}}`)
	}
	if jsTpl := tpl.Lookup("css"); jsTpl == nil {
		tpl.Parse(`{{define "css"}}{{end}}`)
	}

	

	// websocket主机
	

	//定义常量
	data["WEBROOT"] = parse.EnvConfig.Env.Weburl
	data["WEBCSS"] = "/static/css/"
	data["WEBJS"] = "/static/js/"
	buf := new(bytes.Buffer)
	err := tpl.Execute(buf, data)
	if err != nil {
		//objLog.Errorln("excute template error:", err)
		log.Println("解析模板出错", err)
		return err
	}
	log.Println("正在解析模板", tpl)
	return ctx.HTML(http.StatusOK, buf.String())
}
