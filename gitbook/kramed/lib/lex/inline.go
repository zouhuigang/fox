package lex

import (
	"fox/gitbook/kramed/lib/rules"
	"fox/gitbook/kramed/zregexp"
)

//解析[Update with GIT](build/push.md)
func ParseLink(src string) []*zregexp.Group {
	return zregexp.GroupExec2(rules.Link, src)
}
