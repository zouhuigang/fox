package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
)

var _ cmder = (*versionCmd)(nil)

type versionCmd struct {
	*baseCmd
}

func newVersionCmd() *versionCmd {
	return &versionCmd{
		newBaseCmd(&cobra.Command{
			Use:   "version",
			Short: "Print the version number of Fox",
			Long:  `All software has versions. This is Fox's.`,
			RunE: func(cmd *cobra.Command, args []string) error {
				printFoxVersion()
				return nil
			},
		}),
	}
}

func printFoxVersion() {
	fmt.Println("version:1.0.1")
}