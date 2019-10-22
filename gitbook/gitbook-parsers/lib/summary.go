package lib

import (
	"fmt"
	gitbookMarkdown "fox/gitbook/gitbook-markdown/lib"
	"net/url"
	"strings"
)

type NSummary struct {
	Title string //"Introduction"
	Type  string
	Path  string //"README.md"
	Level string //"0","1","1.1"
	// exists       bool //文件是否存在
	External     bool   //是否是外部链接
	Href         string //链接地址
	Introduction bool   //是否是介绍页
	Articles     []*NSummary
}

type Options struct {
	EntryPoint      string //入口页
	EntryPointTitle string //入口标题
	HrefSuffix      string //将.md替换成.html
	Depth           int    //是否显示heading，0不显示,1显示#,2显示##，即:# 标题1 ## 标题2
	//     files: null
}

// Is the link an external link
func isExternal(href string) bool {
	parArr, err := url.Parse(href)
	if err != nil {
		return false
	}
	if parArr.Scheme != "" {
		return true
	}
	return false
}

//get level
func getLevel(preLevel string, index int) string {
	var nextLevel string
	if preLevel == "" {
		nextLevel = fmt.Sprintf("%d", index)
	} else {
		nextLevel = fmt.Sprintf("%s.%d", preLevel, index)
	}

	return nextLevel
}

//base序号是从1开始还是从0开始,preLevel父等级
func normalizeChapters(chapterList []*gitbookMarkdown.Summary, options *Options, preLevel string, base int) []*NSummary {
	dataList := make([]*NSummary, 0)

	for index, chapter := range chapterList {
		index = base + index
		level := getLevel(preLevel, index)

		var introduction bool = false
		if chapter.Path == options.EntryPoint {
			introduction = true
		}
		//fmt.Println("===", chapter.Title)
		item := new(NSummary)
		item.Type = chapter.Type
		item.Level = level
		item.Path = chapter.Path
		item.Title = chapter.Title
		item.Introduction = introduction
		item.External = isExternal(chapter.Path)
		if item.External {
			item.Href = chapter.Path
		} else {
			item.Href = fmt.Sprintf("%s%s", strings.TrimSuffix(chapter.Path, ".md"), options.HrefSuffix)
		}

		if len(chapter.Articles) > 0 {
			dataList1 := normalizeChapters(chapter.Articles, options, level, 1)
			item.Articles = append(item.Articles, dataList1...)
		}
		dataList = append(dataList, item)
	}

	return dataList
}

//introduction: chapter.path == options.entryPoint
func NormalizeSummary(src string, options *Options) []*NSummary {
	if options == nil {
		options = new(Options)
		options.EntryPoint = "README.md"
		options.EntryPointTitle = "Introduction"
		options.HrefSuffix = ".html"
		options.Depth = 2
	}

	sumList := gitbookMarkdown.ParseSummary(src, options.Depth)
	nSumList := normalizeChapters(sumList, options, "", 0)
	return nSumList
}

// func main() {
// 	//读取文件内容
// 	f, _ := ioutil.ReadFile("SUMMARY.md")

// 	md := string(f)
// 	s := NormalizeSummary(md, nil)
// 	for _, v := range s {
// 		//type: 'heading', depth: 1, text: 'Summary'
// 		fmt.Printf("title:%s,path:%s,external:%t,level:%s,articles:%v\n", v.Title, v.Path, v.External, v.Level, v.Articles)
// 		for _, v1 := range v.Articles {
// 			fmt.Printf("===title:%s,path:%s,external:%t,level:%s,articles:%v\n", v1.Title, v1.Path, v1.External, v1.Level, v1.Articles)
// 		}
// 	}
// }
