package controller

import (
	. "fox/http"

	"github.com/labstack/echo"
)

// render html 输出
func render(ctx echo.Context, contentTpl string, data map[string]interface{}) error {
	return Render(ctx, contentTpl, data)
}


