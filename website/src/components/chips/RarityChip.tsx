import { useTheme } from "@/data/useTheme";
import { Chip, ThemeProvider } from "@mui/material";

type RarityChipProps = {
	/** Skill, Title, or Talent tier */
	name: string;
	/** Whether this is a Growth Talent like Concepts Archipelago */
	growth?: boolean;
};

export default function RarityChip({ name, growth }: RarityChipProps) {
	const theme = useTheme(name);
	const label = growth ? `${name}(Growth)` : name;
	return (
		<ThemeProvider theme={theme}>
			<Chip
				variant="filled"
				color="primary"
				label={label}
				size="small"
				sx={{ fontWeight: "bold", textTransform: "none" }}
			/>
		</ThemeProvider>
	);
}
