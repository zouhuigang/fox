// Code generated by go-bindata.
// sources:
// conf/env.yml
// conf/readme.md
// DO NOT EDIT!

package conf

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func bindataRead(data []byte, name string) ([]byte, error) {
	gz, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}

	var buf bytes.Buffer
	_, err = io.Copy(&buf, gz)
	clErr := gz.Close()

	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}
	if clErr != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

type bindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

func (fi bindataFileInfo) Name() string {
	return fi.name
}
func (fi bindataFileInfo) Size() int64 {
	return fi.size
}
func (fi bindataFileInfo) Mode() os.FileMode {
	return fi.mode
}
func (fi bindataFileInfo) ModTime() time.Time {
	return fi.modTime
}
func (fi bindataFileInfo) IsDir() bool {
	return false
}
func (fi bindataFileInfo) Sys() interface{} {
	return nil
}

var _confEnvYml = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x3c\xcc\x41\x0a\x83\x30\x10\x85\xe1\x7d\x4e\xf1\x4e\x90\x31\xdd\x14\xe6\x32\x45\xdb\x69\x12\xd0\x8c\xc4\x19\x5b\x7a\xfa\x22\x82\xcb\xef\xf1\xf8\xa5\xed\x1c\x80\x8f\x4c\xde\x67\x46\x31\x5b\x99\x28\xdd\xee\x71\x88\x43\x4c\x14\x80\x5d\xfa\x56\xb5\x31\xd2\xb1\x04\xc0\x64\x59\xe7\xd1\xe4\xf1\xaa\x9d\x2f\x1d\xd7\x5c\xad\xf8\x74\x66\x36\x26\x3a\x1d\x9f\xba\xd0\x4f\xbd\x78\xcd\x63\xcb\xf4\xd6\xef\x3f\x00\x00\xff\xff\x76\x15\xcb\xaf\x77\x00\x00\x00")

func confEnvYmlBytes() ([]byte, error) {
	return bindataRead(
		_confEnvYml,
		"conf/env.yml",
	)
}

func confEnvYml() (*asset, error) {
	bytes, err := confEnvYmlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "conf/env.yml", size: 119, mode: os.FileMode(438), modTime: time.Unix(1569029304, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _confReadmeMd = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x52\x56\x56\x56\x78\xb2\x77\xff\xf3\x29\x2b\xb8\xb8\x14\x14\x14\x14\xd2\xf3\x75\x93\x32\xf3\x52\x12\x4b\x12\x15\x74\x0b\xb2\xd3\x15\x92\xf3\xf3\xd2\x14\x74\xf3\x15\x32\xf3\x32\x4b\x8a\xf5\xa1\x52\xfa\x20\x51\x30\xa1\x0b\xe2\xea\xa5\xe7\x83\xd5\x01\x02\x00\x00\xff\xff\xf9\x10\x4b\xd5\x4c\x00\x00\x00")

func confReadmeMdBytes() ([]byte, error) {
	return bindataRead(
		_confReadmeMd,
		"conf/readme.md",
	)
}

func confReadmeMd() (*asset, error) {
	bytes, err := confReadmeMdBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "conf/readme.md", size: 76, mode: os.FileMode(438), modTime: time.Unix(1568986413, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	"conf/env.yml": confEnvYml,
	"conf/readme.md": confReadmeMd,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}
var _bintree = &bintree{nil, map[string]*bintree{
	"conf": &bintree{nil, map[string]*bintree{
		"env.yml": &bintree{confEnvYml, map[string]*bintree{}},
		"readme.md": &bintree{confReadmeMd, map[string]*bintree{}},
	}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}

