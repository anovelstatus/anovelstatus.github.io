import { createTheme } from "@mui/material";

export const theme = createTheme({
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
