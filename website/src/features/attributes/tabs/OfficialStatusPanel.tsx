import { ChaptersChip } from "@/components/chips";
import { useChapter, useStatusDictionary } from "@/data/api";
import { Box, Stack, Typography } from "@mui/material";
import { AttributeDescriptions } from "@/features/attributes/AttributeDescriptions";
import { AttributeStatus } from "@/features/attributes/AttributeStatus";
import { getPastMilestones, getLatestStatus, getCurrentEvolution } from "@/features/attributes/helpers";
import { RichTextSpan } from "@/components/RichTextSpan";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";

export function OfficialStatusPanel() {
	const chapter = useChapter();
	const statuses = useStatusDictionary();
	const status = getLatestStatus(statuses, chapter);
	const previousStatus = getLatestStatus(statuses, chapter - 1);

	if (!status) return <LoadingPlaceholder text="Loading status..." />;

	return (
		<Stack spacing={2}>
			<Typography variant="body2" component="div">
				This displays the official status at the bottom of <ChaptersChip chapters={[status.chapter]} />. For calculated
				totals based on skills and titles, check out the other tab.
			</Typography>
			<AttributeStatus status={status} previousStatus={previousStatus} />
			<AttributeDescriptions
				name="Evolutions"
				getNotes={(attribute) => {
					const evolution = getCurrentEvolution(chapter, attribute);
					if (!evolution) return <RichTextSpan data="None" />;
					return [
						<Stack direction="row" key={evolution.name} sx={{ alignItems: "center" }}>
							<ChaptersChip chapters={evolution.chapter} />
							<Box>
								<Typography variant="body2" sx={{ display: "inline" }}>
									{evolution.name || "None"}:{" "}
								</Typography>
								<RichTextSpan data={evolution.note} />
							</Box>
						</Stack>,
					];
				}}
			/>
			<AttributeDescriptions
				name="Descriptions & Milestones"
				getNotes={(attribute) => [
					<RichTextSpan key={attribute.name} data={attribute.note} />,
					...getPastMilestones(status, attribute).map((x) => (
						<Box key={x.milestone}>
							<Typography variant="body2" sx={{ display: "inline" }}>
								{x.milestone}:{" "}
							</Typography>
							<RichTextSpan data={x.note} />
						</Box>
					)),
				]}
			/>
		</Stack>
	);
}
