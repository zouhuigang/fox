package maps

import (
	"strings"

	"github.com/gobwas/glob"

	"github.com/spf13/cast"
)

// ToLower makes all the keys in the given map lower cased and will do so
// recursively.
// Notes:
// * This will modify the map given.
// * Any nested map[interface{}]interface{} will be converted to map[string]interface{}.
func ToLower(m map[string]interface{}) {
	for k, v := range m {
		switch v.(type) {
		case map[interface{}]interface{}:
			v = cast.ToStringMap(v)
			ToLower(v.(map[string]interface{}))
		case map[string]interface{}:
			ToLower(v.(map[string]interface{}))
		}

		lKey := strings.ToLower(k)
		if k != lKey {
			delete(m, k)
			m[lKey] = v
		}

	}
}

type keyRename struct {
	pattern glob.Glob
	newKey  string
}

// KeyRenamer supports renaming of keys in a map.
type KeyRenamer struct {
	renames []keyRename
}

// NewKeyRenamer creates a new KeyRenamer given a list of pattern and new key
// value pairs.
func NewKeyRenamer(patternKeys ...string) (KeyRenamer, error) {
	var renames []keyRename
	for i := 0; i < len(patternKeys); i += 2 {
		g, err := glob.Compile(strings.ToLower(patternKeys[i]), '/')
		if err != nil {
			return KeyRenamer{}, err
		}
		renames = append(renames, keyRename{pattern: g, newKey: patternKeys[i+1]})
	}

	return KeyRenamer{renames: renames}, nil
}

func (r KeyRenamer) getNewKey(keyPath string) string {
	for _, matcher := range r.renames {
		if matcher.pattern.Match(keyPath) {
			return matcher.newKey
		}
	}

	return ""
}

// Rename renames the keys in the given map according
// to the patterns in the current KeyRenamer.
func (r KeyRenamer) Rename(m map[string]interface{}) {
	r.renamePath("", m)
}

func (KeyRenamer) keyPath(k1, k2 string) string {
	k1, k2 = strings.ToLower(k1), strings.ToLower(k2)
	if k1 == "" {
		return k2
	} else {
		return k1 + "/" + k2
	}
}

func (r KeyRenamer) renamePath(parentKeyPath string, m map[string]interface{}) {
	for key, val := range m {
		keyPath := r.keyPath(parentKeyPath, key)
		switch val.(type) {
		case map[interface{}]interface{}:
			val = cast.ToStringMap(val)
			r.renamePath(keyPath, val.(map[string]interface{}))
		case map[string]interface{}:
			r.renamePath(keyPath, val.(map[string]interface{}))
		}

		newKey := r.getNewKey(keyPath)

		if newKey != "" {
			delete(m, key)
			m[newKey] = val
		}
	}
}
