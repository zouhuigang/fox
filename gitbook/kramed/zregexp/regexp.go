package zregexp

import (
	regexp2 "github.com/dlclark/regexp2"
)

//获取正则匹配的值
type Group struct {
	Index int
	Value string
}

func GroupExec(cap [][]string) []*Group {
	gr := make([]*Group, 0)
	for _, match := range cap {
		// fmt.Printf("Match %v: \n", i)
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

// type Group struct {
// 	Capture // the last capture of this group is embeded for ease of use

// 	Name     string    // group name
// 	Captures []Capture // captures of this group
// }
func GroupExec2(re2 *regexp2.Regexp, src string) []*Group {
	_, groupList := m_GroupExec2(re2, src)
	return groupList
}
func m_GroupExec2(re2 *regexp2.Regexp, src string) (*regexp2.Match, []*Group) {

	gr := make([]*Group, 0)
	var new_m *regexp2.Match = new(regexp2.Match)
	if m, _ := re2.FindStringMatch(src); m != nil {
		// the whole match is always group 0
		//fmt.Printf("Group 0: %v\n", m.String())

		// you can get all the groups too
		new_m = m
		gps := m.Groups()
		for j, group := range gps {
			//fmt.Printf("Group %d, first capture:%s,len；%d\n", j, group.Name, len(group.Captures))
			g := new(Group)
			g.Index = j
			if len(group.Captures) > 0 {
				g.Value = group.Captures[0].String()
			}
			gr = append(gr, g)
		}

	}
	return new_m, gr
}

//g模式全局匹配，在匹配到第一个之后，不返回，继续匹配下一个。
func G_GroupExec2(re2 *regexp2.Regexp, src string) [][]*Group {
	gList := make([][]*Group, 0)
	m, groupList := m_GroupExec2(re2, src)
	gList = append(gList, groupList)
	if m != nil {
		gList1 := AllNextMatch(re2, m)
		gList = append(gList, gList1...)
	}
	return gList
}

//递归查找所有节点
func AllNextMatch(re2 *regexp2.Regexp, m *regexp2.Match) [][]*Group {
	gList := make([][]*Group, 0)
	m1, g1 := NextMatch(re2, m)
	if len(g1) > 0 {
		gList = append(gList, g1)
	}

	if m1 != nil {
		gList1 := AllNextMatch(re2, m1)
		gList = append(gList, gList1...)
	}

	return gList
}

//查找下一个节点
func NextMatch(re2 *regexp2.Regexp, m *regexp2.Match) (*regexp2.Match, []*Group) {
	gr := make([]*Group, 0)
	var new_m *regexp2.Match = new(regexp2.Match)
	if m1, _ := re2.FindNextMatch(m); m1 != nil {
		new_m = m1
		// fmt.Printf("Group 0: %v\n", new_m.String())
		gps := m1.Groups()
		for j, group := range gps {
			g := new(Group)
			g.Index = j
			if len(group.Captures) > 0 {
				g.Value = group.Captures[0].String()
			}
			gr = append(gr, g)
		}
	} else {
		new_m = nil
	}
	return new_m, gr
}
