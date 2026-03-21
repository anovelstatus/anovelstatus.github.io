import AppTabs from "@/components/AppTabs";
import { AnalysisPanel, CalculatedStatusPanel, OfficialStatusPanel } from "@/features/attributes/tabs";
import { Stack, Typography } from "@mui/material";

export function AttributePage() {
	const tabLabels = ["Official Status", "Calculated Status", "Analysis"];
	const tabPanels = [
		<OfficialStatusPanel key="official" />,
		<CalculatedStatusPanel key="calculated" />,
		<AnalysisPanel key="analysis" />,
	];

	return (
		<Stack spacing={2}>
			<Typography variant="h3" gutterBottom>
				Priam's Attributes
			</Typography>
			<AppTabs labels={tabLabels} panels={tabPanels} title="Attribute Totals" />
		</Stack>
	);
}
