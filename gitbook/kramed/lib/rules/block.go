package rules

import (
	"regexp"
)

var Heading = regexp.MustCompile(`^ *(#{1,6}) *([^\n]+?) *#* *(?:\n|$)`)
var Text = regexp.MustCompile(`^[^\n]+`)
var Newline = regexp.MustCompile(`^\n+`)

var Code = regexp.MustCompile(`^((?: {4}|\t)[^\n]+\n*)+`)
var Hr = regexp.MustCompile(`^( *[-*_]){3,} *(?:\n|$)`)
var Lheading = regexp.MustCompile(`^([^\n]+)\n *(=|-){2,} *(?:\n|$)`)

//var Blockquote = regexp.MustCompile(`^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+`)
//var List = regexp.MustCompile(`^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)`)
//var Html = regexp.MustCompile(`^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))`)

//var Def = regexp.MustCompile(`^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$)`)
var Footnote = regexp.MustCompile(`^\[\^([^\]]+)\]: ([^\n]+)`)

//var Fences = regexp.MustCompile(`^ *({3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n|$)`)

//var Paragraph = regexp.MustCompile(`^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def|math))+)\n*`)
var Math = regexp.MustCompile(`^ *(\${2,}) *([\s\S]+?)\s*\\1 *(?:\n|$)`)
