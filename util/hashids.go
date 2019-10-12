package util

import (
    "github.com/speps/go-hashids"
)

//salt 盐值
const salt = "fox_"

//Encode 混淆
func Encode(data int) string {
    hd := hashids.NewData()
    hd.Salt = salt
    h, _ := hashids.NewWithData(hd)
    e, _ := h.Encode([]int{data})
    return e
}

//Decode 还原混淆
func Decode(data string) int {
    hd := hashids.NewData()
    hd.Salt = salt
    h, _ := hashids.NewWithData(hd)
    e, _ := h.DecodeWithError(data)
    return e[0]
}