/*
拦截文件请求
*/
package middleware

import (
	"fox/system"

	"fmt"

	"github.com/labstack/echo"
)

func getAccept(ctx echo.Context) string {
	if accept := ctx.Request().Header.Get("Accept"); accept != "" {
		return accept
	}

	return ""
}

//检测静态资源
//https://stackoverflow.com/questions/23115581/can-i-explicitly-specify-a-mime-type-in-an-img-tag
func CheckStatic() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			data := map[string]interface{}{}
			//设置跨域
			ctx.Response().Header().Set("Access-Control-Allow-Origin", "*")
			accept := getAccept(ctx)
			if accept == "" {
				return system.ResponeJson(ctx, system.ErrUnknown, data, "错误的文件类型")
			}

			fmt.Println("===", accept)

			//跳转下一个处理
			if err := next(ctx); err != nil {
				return err
			}

			return nil
		}
	}
}
