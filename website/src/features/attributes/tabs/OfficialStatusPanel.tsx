import { ChaptersChip } from "@/components/chips";
import { useChapter, useStatusDictionary } from "@/data/api";
import { Stack, Typography } from "@mui/material";
import { AttributeDescriptions } from "../AttributeDescriptions";
import { AttributeStatus } from "../AttributeStatus";
import { getPastMilestones, getPastEvolutions } from "../helpers";

export function OfficialStatusPanel() {
	const chapter = useChapter();
	const statuses = useStatusDictionary();
	const status = getLatestStatus(statuses, chapter);
	if (!status) return <></>;
	const previousStatus = getLatestStatus(statuses, chapter - 1);
	return (
		<Stack spacing={2}>
			<Typography variant="body2" component="div">
				This displays the official status at the bottom of <ChaptersChip chapters={[status.chapter]} />. For calculated
				totals based on skills and titles, check out the other tab.
			</Typography>
			<AttributeStatus status={status} previousStatus={previousStatus} />
			<AttributeDescriptions name="Descriptions" getNotes={(attribute) => [attribute.note]} />
			<AttributeDescriptions
				name="Milestones"
				getNotes={(attribute) => getPastMilestones(status, attribute).map((x) => `${x.milestone}: ${x.note}`)}
			/>
			<AttributeDescriptions
				name="Evolutions"
				getNotes={(attribute) =>
					getPastEvolutions(status, attribute)
						.slice(-1)
						.map((evolution) => `${evolution.name || "None"}: ${evolution.note}`)
				}
			/>
		</Stack>
	);
}

/** Find the latest status for a given chapter or earlier */
function getLatestStatus(statuses: Record<number, Status>, chapter: number): Status | undefined {
	while (chapter >= 1) {
		const status = statuses[chapter];
		if (status) return status;
		chapter--;
	}
	return undefined;
}
