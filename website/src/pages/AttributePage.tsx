import AppTabs from "@/components/AppTabs";
import { ChaptersChip } from "@/components/chips";
import { useChapter, useStatuses } from "@/data/api";
import {
	AttributeDescriptions,
	AttributeStatus,
	getStatus,
	getPastMilestones,
	getPastEvolutions,
	useCalculatedStatus,
} from "@/features/attributes";
import { Stack, Typography } from "@mui/material";

export function AttributePage() {
	const chapter = useChapter();

	const tabLabels = ["Official Status", "Calculated Status"];
	const tabPanels = [<OfficialPanel key="official" />, <CalculatedPanel key="calculated" />];

	return (
		<Stack spacing={2}>
			<Typography variant="h3" gutterBottom>
				Priam's Attributes <ChaptersChip chapters={[chapter]} />
			</Typography>
			<AppTabs labels={tabLabels} panels={tabPanels} title="Attribute Totals" />
		</Stack>
	);
}

function OfficialPanel() {
	const chapter = useChapter();
	const { data: statuses } = useStatuses();
	const status = getStatus(statuses, chapter);
	if (!status) return <></>;
	const previousStatus = getStatus(statuses, chapter - 1);
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

function CalculatedPanel() {
	const chapter = useChapter();
	const status = useCalculatedStatus(chapter);
	if (!status) return <></>;

	const previousStatus = useCalculatedStatus(chapter - 1);

	return (
		<Stack spacing={2}>
			<Typography variant="body2">
				This displays a calculated status based on total skill levels and title boosts. For official published numbers,
				check out the other tab.
			</Typography>
			<AttributeStatus status={status} previousStatus={previousStatus} />
			<Typography>Under construction 🚧</Typography>
		</Stack>
	);
}
