package lib

import (
	"fox/gitbook/kramed"
	"fox/gitbook/kramed/lib/lex"
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

func filterList(nodes []*lex.Token, st string, et string, depth int) [][]*lex.Token {
	new_nodes_list := make([][]*lex.Token, 0)
	var new_nodes []*lex.Token

	pp_st_num := 0 //匹配到的list_start的个数,匹配到list_end时减去1
	for _, node := range nodes {
		//fmt.Printf("[%s]-[%s]\n", node.Type, node.Text)
		if depth == node.Depth && node.Type == "heading" { //类型为:heading是否显示
			new_nodes = make([]*lex.Token, 0)
			new_nodes = append(new_nodes, node)
			new_nodes_list = append(new_nodes_list, new_nodes)
			continue
		}

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

	// for index, v1 := range new_nodes_list {
	// 	fmt.Printf("====%d==\n", index)

	// 	for _, v2 := range v1 {

	// 		fmt.Printf("======[%s]-[%s]\n", v2.Type, v2.Text)
	// 	}
	// }

	return new_nodes_list
}

func ListGroups(src string, depth int) [][]*lex.Token {
	var nodes = kramed.Lexer(src)

	groupList := filterList(skipSpace(nodes), "list_start", "list_end", depth)

	return groupList
}

type Summary struct {
	Title    string
	Type     string
	Path     string
	Articles []*Summary
}

func parseTitle(src string, m_type string) *Summary {
	// Check if it's a link
	var group = lex.ParseLink(src)
	// Not a link, return plain text
	t := new(Summary)
	if len(group) == 0 {
		t.Title = src
		t.Path = ""
		t.Type = m_type
	} else {
		t.Title = group[1].Value
		t.Path = group[2].Value
		t.Type = m_type
	}

	return t
}

//递归解析
func parseChapter(nodes []*lex.Token, depth int) []*Summary {
	sumList := make([]*Summary, 0)
	if len(nodes) == 0 {
		return sumList
	}

	//取第一个
	sum := parseTitle(nodes[0].Text, nodes[0].Type)
	if len(nodes) > 1 {
		newNodes := filterList(skipSpace(nodes[1:]), "list_start", "list_end", 0)
		for _, v := range newNodes {
			sumList1 := parseChapter(v, depth)
			sum.Articles = append(sum.Articles, sumList1...)
		}
	}

	sumList = append(sumList, sum)

	return sumList

}

func ParseSummary(src string, depth int) []*Summary {
	sumList := make([]*Summary, 0)
	tokenList := ListGroups(src, depth)
	for _, v := range tokenList {
		sumList1 := parseChapter(v, depth)
		sumList = append(sumList, sumList1...)
	}
	return sumList
}
