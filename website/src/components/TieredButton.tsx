import { Button, type ButtonProps, ThemeProvider } from "@mui/material";
import { useTheme } from "@/data/useTheme";
import { toIdString } from "@/data/helpers";

export type TieredButtonProps = ButtonProps & {
	item: TieredId;
};

export default function TieredButton({ item, ...props }: TieredButtonProps) {
	const theme = useTheme(item.tier);
	return (
		<ThemeProvider theme={theme}>
			<Button {...props}>{toIdString(item)}</Button>
		</ThemeProvider>
	);
}
