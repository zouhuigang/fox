package kramed

import (
	"fox/gitbook/kramed/lib/lex"
)

func Lexer(md string) []*lex.Token {
	return lex.Parse(md)
}
