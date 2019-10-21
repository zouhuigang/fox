package lex

import (
	"fox/gitbook/kramed/lib/rules"
	"fox/gitbook/kramed/zregexp"
	"regexp"
)



type Token struct {
	Type    string
	Lang    string
	Text    string
	Refname string
	Ordered bool
	Depth   int //根据#的数量判断
}

//换行符=>\n
var m_linefeed = regexp.MustCompile(`\r\n|\r`)

//tab=>'    '
var m_tab = regexp.MustCompile(`\t`)

//space=>' '
var m_space = regexp.MustCompile("\u00a0")

//=>"\n"
var m_l = regexp.MustCompile("\u2424")

var m_re = regexp.MustCompile(`(?m)^ +$`)

/*
js:
		src = src.replace(/\r\n|\r/g, '\n')
		  .replace(/\t/g, '    ')
		  .replace(/\u00a0/g, ' ')
		  .replace(/\u2424/g, '\n');
*/
func Parse(src string) []*Token {
	src = m_linefeed.ReplaceAllString(src, "\n")
	src = m_tab.ReplaceAllString(src, "    ")
	src = m_space.ReplaceAllString(src, " ")
	src = m_l.ReplaceAllString(src, "\n")

	//return this.token(src, true);

	return token(src)
}

func token(src string) []*Token {
	dataList := make([]*Token, 0)

	src = m_re.ReplaceAllString(src, "")

	for {

		// newline
		cap := zregexp.GroupExec(rules.Newline.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			//删掉
			src = src[len(cap[0].Value):]
			if len(cap[0].Value) > 1 {
				item := new(Token)
				item.Type = "space"
				dataList = append(dataList, item)
			}
		}

		//code
		cap = zregexp.GroupExec(rules.Code.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			//删掉
			src = src[len(cap[0].Value):]
			item := new(Token)
			item.Type = "code"
			item.Text = cap[0].Value
			dataList = append(dataList, item)
			continue
		}

		// footnote
		cap = zregexp.GroupExec(rules.Footnote.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			src = src[len(cap[0].Value):]
			item := new(Token)
			item.Type = "footnote"
			item.Refname = cap[1].Value
			item.Text = cap[2].Value
			dataList = append(dataList, item)
			continue
		}

		// math
		cap = zregexp.GroupExec(rules.Math.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			src = src[len(cap[0].Value):]
			item := new(Token)
			item.Type = "math"
			item.Text = cap[2].Value
			continue
		}

		//heading
		cap = zregexp.GroupExec(rules.Heading.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			//删掉
			src = src[len(cap[0].Value):]
			item := new(Token)
			item.Type = "heading"
			item.Depth = len(cap[1].Value)
			item.Text = cap[2].Value
			dataList = append(dataList, item)
			continue
		}

		//list
		cap = zregexp.GroupExec2(rules.List, src)
		if len(cap) > 0 {
			src = src[len(cap[0].Value):]
			// fmt.Println(cap[2])
			bull := cap[2].Value
			ordered := false
			if len(bull) > 1 {
				ordered = true
			}

			item := new(Token)
			item.Type = "list_start"
			item.Ordered = ordered
			dataList = append(dataList, item)

			// // Get each top-level item.
			// cap = cap[0].match(this.rules._item);
			capList := zregexp.G_GroupExec2(rules.Item, cap[0].Value)

			//next := false

			for i := 0; i < len(capList); i++ {
				mItem := capList[i][0].Value
				//space := len(mItem)
				//移除bullet
				re := regexp.MustCompile(`^ *([*+-]|\d+\.) +`)
				mItem = re.ReplaceAllString(mItem, "")

				// fmt.Println("item", mItem)

				item = new(Token)
				item.Type = "list_item_start"
				dataList = append(dataList, item)

				itemList := token(mItem)
				dataList = append(dataList, itemList...)

				item = new(Token)
				item.Type = "list_item_end"
				dataList = append(dataList, item)
			}

			item = new(Token)
			item.Type = "list_end"
			dataList = append(dataList, item)

			continue
		}

		// text
		cap = zregexp.GroupExec(rules.Text.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {

			src = src[len(cap[0].Value):]
			item := new(Token)
			item.Type = "text"
			item.Text = cap[0].Value
			dataList = append(dataList, item)
			continue
		}

		if src == "" {
			break
		}
	}

	return dataList
}
