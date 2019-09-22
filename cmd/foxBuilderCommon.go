package cmd

import "github.com/spf13/cobra"
type foxBuilderCommon struct {
	source      string
	baseURL     string
	environment string

}

func (cc *foxBuilderCommon) handleCommonBuilderFlags(cmd *cobra.Command) {
	cmd.PersistentFlags().StringVarP(&cc.source, "source", "s", "", "filesystem path to read files relative from")
	cmd.PersistentFlags().SetAnnotation("source", cobra.BashCompSubdirsInDir, []string{})
	cmd.PersistentFlags().StringVarP(&cc.environment, "environment", "e", "", "build environment")
	cmd.PersistentFlags().StringP("themesDir", "", "", "filesystem path to themes directory")
	cmd.PersistentFlags().BoolP("ignoreVendor", "", false, "ignores any _vendor directory")
}

func (cc *foxBuilderCommon) handleFlags(cmd *cobra.Command) {
	cc.handleCommonBuilderFlags(cmd)
	cmd.Flags().StringSliceP("theme", "t", []string{}, "themes to use (located in /fox.themes/THEMENAME/)")
	_ = cmd.Flags().SetAnnotation("theme", cobra.BashCompSubdirsInDir, []string{"themes"})

}