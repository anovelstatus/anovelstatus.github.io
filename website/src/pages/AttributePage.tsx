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
			<AttributeDescriptions name="Descriptions" getNote={(attribute) => attribute.note} />
			<AttributeDescriptions
				name="Milestones"
				getNote={(attribute) =>
					getPastMilestones(status, attribute).map((milestone) => `${milestone.milestone}: ${milestone.note}`)
				}
			/>
			<AttributeDescriptions
				name="Evolutions"
				getNote={(attribute) =>
					getPastEvolutions(status, attribute)
						.slice(-1)
						.map((evolution) => `${evolution.name || "None"}: ${evolution.note}`)
				}
			/>
		</Stack>
	);
}
