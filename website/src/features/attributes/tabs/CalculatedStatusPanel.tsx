import { useChapter } from "@/data/api";
import { Stack, Typography } from "@mui/material";
import { AttributeStatus } from "../AttributeStatus";
import { useChapterGains, useCalculatedStatus } from "../helpers";
import ChaptersChip from "@/components/chips/ChaptersChip";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";

export function CalculatedStatusPanel() {
	const chapter = useChapter();
	const status = useCalculatedStatus(chapter);
	const previousStatus = useCalculatedStatus(chapter - 1);

	const gains = useChapterGains(chapter);
	if (!gains.length) gains.push("No skill or title gains recorded for this chapter.");

	if (!status) return <LoadingPlaceholder text="Loading skills and titles..." />;

	return (
		<Stack spacing={2}>
			<Typography variant="body2" component="div">
				This displays a calculated status for <ChaptersChip chapters={[chapter]} /> based on total skill levels and
				title boosts. For official published numbers, check out the other tab.
			</Typography>
			<AttributeStatus status={status} previousStatus={previousStatus} />
			<Typography variant="h4">Gains This Chapter</Typography>
			<Stack>{gains}</Stack>
		</Stack>
	);
}
