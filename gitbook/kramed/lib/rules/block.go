package rules

import (
	"regexp"

	"github.com/dlclark/regexp2"
)

/*
g: 全局匹配
i: 忽略大小写
gi: 以上组合

\s 匹配一个空白字符，包括\n,\r,\f,\t,\v等
\S 匹配一个非空白字符，等于/[^\n\f\r\t\v]/
[\s\S]匹配任何字符
\1匹配到的第一个group的值
\2匹配到的第二个group的值

https://blog.csdn.net/jiaoyongqing134/article/details/52718315

Go translates JavaScript-style regular expressions into something that is "regexp" compatible via parser.TransformRegExp. Unfortunately, RegExp requires backtracking for some patterns, and backtracking is not supported by the standard Go engine: https://code.google.com/p/re2/wiki/Syntax

Therefore, the following syntax is incompatible:

(?=)  // Lookahead (positive), currently a parsing error
(?!)  // Lookahead (backhead), currently a parsing error
\1    // Backreference (\1, \2, \3, ...), currently a parsing error
https://github.com/robertkrimen/otto
const (
    None                    RegexOptions = 0x0
    IgnoreCase                           = 0x0001 // "i"
    Multiline                            = 0x0002 // "m"
    ExplicitCapture                      = 0x0004 // "n"
    Compiled                             = 0x0008 // "c"
    Singleline                           = 0x0010 // "s"
    IgnorePatternWhitespace              = 0x0020 // "x"
    RightToLeft                          = 0x0040 // "r"
    Debug                                = 0x0080 // "d"
    ECMAScript                           = 0x0100 // "e"
    RE2                                  = 0x0200 // RE2 (regexp package) compatibility mode
)
*/

var Heading = regexp.MustCompile(`^ *(#{1,6}) *([^\n]+?) *#* *(?:\n|$)`)
var Text = regexp.MustCompile(`^[^\n]+`)
var Newline = regexp.MustCompile(`^\n+`)

var Code = regexp.MustCompile(`^((?: {4}|\t)[^\n]+\n*)+`)
var Hr = regexp.MustCompile(`^( *[-*_]){3,} *(?:\n|$)`)
var Lheading = regexp.MustCompile(`^([^\n]+)\n *(=|-){2,} *(?:\n|$)`)

//var Blockquote = regexp.MustCompile(`^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+`)
//var List = regexp2.MustCompile(`^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)`, 1)
var List = regexp2.MustCompile(`^( *)((?:[*+-]|\d+\.)) [\s\S]+?(?:\n+(?=\1?(?:[-*_] *){3,}(?:\n+|$))|\n+(?= *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$))|\n{2,}(?! )(?!\1(?:[*+-]|\d+\.) )\n*|\s*$)`, 1)

//var Html = regexp.MustCompile(`^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))`)

//var Def = regexp.MustCompile(`^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$)`)
var Footnote = regexp.MustCompile(`^\[\^([^\]]+)\]: ([^\n]+)`)

//var Fences = regexp.MustCompile(`^ *({3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n|$)`)

//var Paragraph = regexp.MustCompile(`^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def|math))+)\n*`)
var Math = regexp.MustCompile(`^ *(\${2,}) *([\s\S]+?)\s*\\1 *(?:\n|$)`)
var Item = regexp2.MustCompile(`^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!\1(?:[*+-]|\d+\.) )[^\n]*)*`, 2)

// `Func`变量可以让你将所有匹配的字符串都经过该函数处理
///^( *)((?:[*+-]|\d+\.)) [\s\S]+?(?:\n+(?=\1?(?:[-*_] *){3,}(?:\n+|$))|\n+(?= *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$))|\n{2,}(?! )(?!\1(?:[*+-]|\d+\.) )\n*|\s*$)/

//解析title
