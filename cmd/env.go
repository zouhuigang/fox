package cmd

/*
新建一个cmd，然后注册进commands
*/
import (
	"runtime"

	"github.com/spf13/cobra"
	"github.com/zouhuigang/golog"
)

var _ cmder = (*envCmd)(nil)

type envCmd struct {
	*baseCmd
}

func newEnvCmd() *envCmd {
	return &envCmd{baseCmd: newBaseCmd(&cobra.Command{
		Use:   "env",
		Short: "Print Fox version and environment info",
		Long:  `Print Fox version and environment info. This is useful in Fox bug reports.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			printFoxVersion()
			golog.SetTimeFormat("")
			golog.Print("GOOS=", runtime.GOOS)
			golog.Print("GOARCH=", runtime.GOARCH)
			golog.Print("GOVERSION=", runtime.Version())

			return nil
		},
	}),
	}
}
