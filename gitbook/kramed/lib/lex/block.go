package main

import (
	"fmt"
	"fox/gitbook/kramed/lib/rules"
	"io/ioutil"
	"regexp"
)

type Token struct {
	Type    string
	Lang    string
	Text    string
	Refname string
	Depth   int //根据#的数量判断
}

func main() {
	//读取文件内容
	f, _ := ioutil.ReadFile("SUMMARY.md")

	md := string(f)
	s := Parse(md)
	for _, v := range s {
		//type: 'heading', depth: 1, text: 'Summary'
		fmt.Printf("%v\n", v)
	}
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

//获取正则匹配的值
type Group struct {
	Index int
	Value string
}

func groupExec(cap [][]string) []*Group {
	gr := make([]*Group, 0)
	for _, match := range cap {
		//fmt.Printf("Match %v: \n", i)
		for j, group := range match {
			//fmt.Printf("Group %v: %v \n", j, group)
			g := new(Group)
			g.Index = j
			g.Value = group
			gr = append(gr, g)
		}
	}
	return gr
}

func token(src string) []*Token {
	dataList := make([]*Token, 0)
	src = m_re.ReplaceAllString(src, "")

	var i int = 0
	for {
		i++

		// newline
		cap := groupExec(rules.Newline.FindAllStringSubmatch(src, -1))
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
		cap = groupExec(rules.Code.FindAllStringSubmatch(src, -1))
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
		cap = groupExec(rules.Footnote.FindAllStringSubmatch(src, -1))
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
		cap = groupExec(rules.Math.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			src = src[len(cap[0].Value):]
			item := new(Token)
			item.Type = "math"
			item.Text = cap[2].Value
			continue
		}

		//heading
		cap = groupExec(rules.Heading.FindAllStringSubmatch(src, -1))
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
		cap = groupExec(rules.List.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			src = src[len(cap[0].Value):]
			// bull = cap[2];
	  
			// this.tokens.push({
			//   type: 'list_start',
			//   ordered: bull.length > 1
			// });
	  
			// // Get each top-level item.
			// cap = cap[0].match(this.rules._item);
	  
			// next = false;
			// l = cap.length;
			// i = 0;
	  
			// for (; i < l; i++) {
			//   item = cap[i];
	  
			//   // Remove the list item's bullet
			//   // so it is seen as the next token.
			//   space = item.length;
			//   item = item.replace(/^ *([*+-]|\d+\.) +/, '');
	  
			//   // Outdent whatever the
			//   // list item contains. Hacky.
			//   if (~item.indexOf('\n ')) {
			// 	space -= item.length;
			// 	item = !this.options.pedantic
			// 	  ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
			// 	  : item.replace(/^ {1,4}/gm, '');
			//   }
	  
			//   // Determine whether the next list item belongs here.
			//   // Backpedal if it does not belong in this list.
			//   if (this.options.smartLists && i !== l - 1) {
			// 	b = block._bullet.exec(cap[i + 1])[0];
			// 	if (bull !== b && !(bull.length > 1 && b.length > 1)) {
			// 	  src = cap.slice(i + 1).join('\n') + src;
			// 	  i = l - 1;
			// 	}
			//   }
	  
			//   // Determine whether item is loose or not.
			//   // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
			//   // for discount behavior.
			//   loose = next || /\n\n(?!\s*$)/.test(item);
			//   if (i !== l - 1) {
			// 	next = item.charAt(item.length - 1) === '\n';
			// 	if (!loose) loose = next;
			//   }
	  
			//   this.tokens.push({
			// 	type: loose
			// 	  ? 'loose_item_start'
			// 	  : 'list_item_start'
			//   });
	  
			//   // Recurse.
			//   this.token(item, false, bq);
	  
			//   this.tokens.push({
			// 	type: 'list_item_end'
			//   });
			// }
	  
			// this.tokens.push({
			//   type: 'list_end'
			// });
	  
			continue
		  }


		// text
		cap = groupExec(rules.Text.FindAllStringSubmatch(src, -1))
		if len(cap) > 0 {
			src = src[len(cap[0].Value):]
			item := new(Token)
			item.Type = "text"
			item.Text = cap[0].Value
			dataList = append(dataList, item)
			continue
		}

		// fmt.Println(src)
		// if (cap = .heading.exec(src)) {
		// 	// console.info("wwwwwwww",cap);
		// 	src = src.substring(cap[0].length);
		// 	this.tokens.push({
		// 	  type: 'heading',
		// 	  depth: cap[1].length,
		// 	  text: cap[2]
		// 	});
		// 	continue;
		//   }

		if i >= 10 {
			break
		}

		if src == "" {
			break
		}
	}

	return dataList
}
