import { useChapter, useStatuses } from "@/data/api";
import {
	AttributeDescriptions,
	AttributeStatus,
	getStatus,
	getPastMilestones,
	getPastEvolutions,
} from "@/features/attributes";
import { Stack } from "@mui/material";

export function AttributePage() {
	const chapter = useChapter();
	const { data: statuses } = useStatuses();
	const status = getStatus(statuses, chapter);
	if (!status) return <></>;

	return (
		<Stack spacing={2}>
			<AttributeStatus />
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
