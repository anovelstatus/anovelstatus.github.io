import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { PropsWithChildren } from "react";

const theme = createTheme({
	palette: {
		mode: "dark",
	},
	components: {
		// Name of the component
		MuiStack: {
			defaultProps: {
				useFlexGap: true,
				spacing: 1,
			},
		},
	},
});

export function AppThemeProvider({ children }: PropsWithChildren) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			{children}
		</ThemeProvider>
	);
}
