import { LoreSection } from "@/components/LoreSection";
import { SkillTable } from "@/features/skills";
import { Stack, Typography } from "@mui/material";

export function SkillPage() {
	return (
		<Stack spacing={2}>
			<Typography variant="h4" gutterBottom>
				Priam's Skills
			</Typography>
			<LoreSection topic="Skills" />
			<SkillTable />
		</Stack>
	);
}
