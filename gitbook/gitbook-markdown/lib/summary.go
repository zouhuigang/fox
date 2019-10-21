package main

import (
	"fmt"
	"fox/gitbook/kramed"
	"fox/gitbook/kramed/lib/lex"
	"io/ioutil"
)

func skipSpace(nodes []*lex.Token) []*lex.Token {
	new_nodes := make([]*lex.Token, 0)
	for _, node := range nodes {
		if node.Type != "space" {
			new_nodes = append(new_nodes, node)
		}
	}
	return new_nodes
}

func filterList(nodes []*lex.Token, st string, et string) [][]*lex.Token {
	new_nodes_list := make([][]*lex.Token, 0)
	var new_nodes []*lex.Token

	pp_st_num := 0 //匹配到的list_start的个数,匹配到list_end时减去1
	for _, node := range nodes {
		if node.Type == st {
			pp_st_num++
		}
		if node.Type == et {
			pp_st_num--
		}

		if pp_st_num == 1 {
			if node.Type == "list_item_end" {
				new_nodes_list = append(new_nodes_list, new_nodes)
				continue
			} else if node.Type == "list_item_start" {
				new_nodes = make([]*lex.Token, 0)
			} else {
				new_nodes = append(new_nodes, node)
			}

		} else if pp_st_num > 1 {
			new_nodes = append(new_nodes, node)
		} else {
			continue
		}

	}

	return new_nodes_list
}

func ListGroups(src string) [][]*lex.Token {
	var nodes = kramed.Lexer(src)

	// return listSplit(
	//     filterList(correctLoose(skipSpace(nodes))),
	//     'list_item_start', 'list_item_end'
	// );
	groupList := filterList(skipSpace(nodes), "list_start", "list_end")

	return groupList
}

type Summary struct {
	Title    string
	Path     string
	Articles []*Summary
}

func parseTitle(src string) *Summary {
	// Check if it's a link
	var group = lex.ParseLink(src)
	// Not a link, return plain text
	t := new(Summary)
	if len(group) == 0 {
		t.Title = src
		t.Path = ""
	} else {
		t.Title = group[1].Value
		t.Path = group[2].Value
	}

	return t
}

//递归解析
func parseChapter(nodes []*lex.Token) []*Summary {
	sumList := make([]*Summary, 0)
	if len(nodes) == 0 {
		return sumList
	}

	//取第一个
	sum := parseTitle(nodes[0].Text)

	if len(nodes) > 1 {
		newNodes := filterList(skipSpace(nodes[1:]), "list_start", "list_end")
		for _, v := range newNodes {
			sumList1 := parseChapter(v)
			sum.Articles = append(sum.Articles, sumList1...)
		}
	}
	sumList = append(sumList, sum)

	return sumList

}

func ParseSummary(src string) []*Summary {
	sumList := make([]*Summary, 0)
	tokenList := ListGroups(src)
	for _, v := range tokenList {
		sumList1 := parseChapter(v)
		sumList = append(sumList, sumList1...)
	}

	return sumList
}

func main() {
	//读取文件内容
	f, _ := ioutil.ReadFile("SUMMARY.md")

	md := string(f)
	s := ParseSummary(md)
	for _, v := range s {
		//type: 'heading', depth: 1, text: 'Summary'
		fmt.Printf("title:%s,path:%s,articles:%v\n", v.Title, v.Path, v.Articles)
		for _, v1 := range v.Articles {
			fmt.Printf("======title1:%s,path1:%s,articles1:%v\n", v1.Title, v1.Path, v1.Articles)
		}
	}
}
