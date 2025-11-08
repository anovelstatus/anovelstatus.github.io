import { useTheme } from "@/data/useTheme";
import { Chip, ThemeProvider } from "@mui/material";

type RarityButtonChipProps = {
	/** Skill, Title, or Talent tier */
	name: string;
	/** Whether this is a Growth Talent like Concepts Archipelago */
	growth?: boolean;
	/** Whether to show filled for emphasis or just outlined */
	isActive?: boolean;
	/** Any other text to show before the tier name */
	prefix?: string;
	onClick: (event: React.MouseEvent) => void;
};

export default function RarityButtonChip({ prefix, name, growth, isActive, onClick }: RarityButtonChipProps) {
	const theme = useTheme(name);
	const label = growth ? `${name}(Growth)` : name;
	return (
		<ThemeProvider theme={theme}>
			<Chip
				onClick={onClick}
				variant={isActive ? "filled" : "outlined"}
				color="primary"
				label={prefix + label}
				size="small"
				sx={{ fontWeight: "bold", textTransform: "none" }}
			/>
		</ThemeProvider>
	);
}
