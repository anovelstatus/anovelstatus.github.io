import { useChapter } from "@/data/api";
import { Stack, Typography } from "@mui/material";
import { AttributeStatus } from "../AttributeStatus";
import { getChapterGains, useCalculatedStatus } from "../helpers";

export function CalculatedStatusPanel() {
	const chapter = useChapter();
	const status = useCalculatedStatus(chapter);
	if (!status) return <></>;

	const gains = getChapterGains(chapter);
	if (!gains.length) gains.push("No skill or title gains recorded for this chapter.");

	const previousStatus = useCalculatedStatus(chapter - 1);

	return (
		<Stack spacing={2}>
			<Typography variant="body2">
				This displays a calculated status based on total skill levels and title boosts. For official published numbers,
				check out the other tab.
			</Typography>
			<AttributeStatus status={status} previousStatus={previousStatus} />
			<Typography variant="h4">Gains This Chapter</Typography>
			<Stack>
				{gains.map((gain, index) => (
					<Typography key={index} variant="body2">
						{gain}
					</Typography>
				))}
			</Stack>
		</Stack>
	);
}
