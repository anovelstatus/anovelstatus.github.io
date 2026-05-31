import AppTabs from "@/components/AppTabs";
import {
	AnalysisPanel,
	CalculatedStatusPanel,
	OfficialStatusPanel,
	TribulationPanel,
} from "@/features/attributes/tabs";
import { LoreSection } from "@/components/LoreSection";
import { Stack, Typography } from "@mui/material";

export function AttributePage() {
	const tabLabels = ["Official Status", "Calculated Status", "Analysis", "Tribulation Thresholds"];
	const tabPanels = [
		<OfficialStatusPanel key="official" />,
		<CalculatedStatusPanel key="calculated" />,
		<AnalysisPanel key="analysis" />,
		<TribulationPanel key="tribulation" />,
	];

	return (
		<Stack spacing={2}>
			<Typography variant="h3" gutterBottom>
				Priam's Attributes
			</Typography>
			<LoreSection topic="Attributes" />
			<AppTabs labels={tabLabels} panels={tabPanels} title="Attribute Totals" />
		</Stack>
	);
}
