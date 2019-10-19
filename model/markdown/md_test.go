package markdown

import (
	"testing"
)

func TestParseSummary(t *testing.T) {
	_, s1 := ParseSummary("D:\\workspacego\\src\\fox\\fox.wiki\\SUMMARY.md")
	expect := ""
	if expect != s1 {
		t.Errorf("got [%s] expected [%s]", s1, expect)
	}
}
