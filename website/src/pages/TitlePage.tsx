import AppTabs from "@/components/AppTabs";
import { LoreSection } from "@/components/LoreSection";
import { TitleTable } from "@/features/titles";
import TreesOfMerit from "@/features/titles/merits/TreesOfMerit";
import { Stack, Typography } from "@mui/material";

export function TitlePage() {
	const tabLabels = ["Titles", "Trees of Merit"];
	const tabPanels = [<TitleTable key="titles" />, <TreesOfMerit key="merits" />];
	return (
		<Stack spacing={2}>
			<Typography variant="h4" gutterBottom>
				Priam's Titles
			</Typography>
			<LoreSection topic="Titles" />
			<AppTabs labels={tabLabels} panels={tabPanels} title="Titles and Merits" />
		</Stack>
	);
}
