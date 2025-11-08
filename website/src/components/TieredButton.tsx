import { Button, type ButtonProps, ThemeProvider } from "@mui/material";
import { useTheme } from "@/data/useTheme";
import { toIdString } from "@/data/helpers";

export type RarityButtonProps = ButtonProps & {
	item: TieredId;
};

export default function RarityButton({ item, ...props }: RarityButtonProps) {
	const theme = useTheme(item.tier);
	return (
		<ThemeProvider theme={theme}>
			<Button {...props}>{toIdString(item)}</Button>
		</ThemeProvider>
	);
}
