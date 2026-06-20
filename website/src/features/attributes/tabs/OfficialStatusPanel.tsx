import { ChaptersChip } from "@/components/chips";
import { useChapter, useStatuses } from "@/data/api";
import { Box, Stack, Typography } from "@mui/material";
import { AttributeGrid } from "@/features/attributes/AttributeGrid";
import { AttributeStatus } from "@/features/attributes/AttributeStatus";
import { getPastMilestones, getLatestStatus, getCurrentEvolution } from "@/features/attributes/helpers";
import { RichTextSpan } from "@/components/RichTextSpan";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { LoreSection } from "@/components/LoreSection";
import { ItemLinkButton } from "@/components/ItemLinkButton";
import { WrappedRow } from "@/components/WrappedRow";

export function OfficialStatusPanel() {
	const chapter = useChapter();
	const { data: statuses } = useStatuses();
	const status = getLatestStatus(statuses, chapter);
	const previousStatus = getLatestStatus(statuses, chapter - 1);

	if (!status) return <LoadingPlaceholder text="Loading status..." />;

	return (
		<Stack spacing={2}>
			<Typography variant="body2" component="div">
				This displays the official status at the bottom of <ChaptersChip chapters={[status.chapter]} />. For calculated
				totals based on skills and titles, check out the other tab.
			</Typography>
			<AttributeStatus
				chapter={status.chapter}
				status={status.attributes}
				previousStatus={previousStatus?.attributes}
			/>
			<Typography variant="h4" gutterBottom>
				Evolutions
			</Typography>
			<LoreSection topic="Attributes" subtopic="Evolution" />
			<AttributeGrid formatAttribute={(attribute) => <EvolutionDisplay key={attribute.name} attribute={attribute} />} />
			<Typography variant="h4" gutterBottom>
				Descriptions & Milestones
			</Typography>
			<AttributeGrid
				formatAttribute={(attribute) => (
					<DescriptionDisplay key={attribute.name} attribute={attribute} status={status.attributes} />
				)}
			/>
		</Stack>
	);
}

function EvolutionDisplay({ attribute }: { attribute: Attribute.Details }) {
	const chapter = useChapter();
	const evolution = getCurrentEvolution(chapter, attribute);
	if (!evolution)
		return (
			<Box>
				<Typography variant="subtitle1" component="span" sx={{ fontWeight: "bold" }}>
					{attribute.name}
				</Typography>
				<Typography variant="body2" component="span">
					{" - None"}
				</Typography>
			</Box>
		);
	return (
		<Stack>
			<WrappedRow>
				<Typography variant="subtitle1">
					<span style={{ fontWeight: "bold" }}>{attribute.name}</span> - {evolution.name || "None"}
				</Typography>
				<ChaptersChip chapters={evolution.chapter} />
				<ItemLinkButton link={evolution.link} />
			</WrappedRow>
			<RichTextSpan data={evolution.note} />
		</Stack>
	);
}

function DescriptionDisplay({ attribute, status }: { attribute: Attribute.Details; status: number[] }) {
	return (
		<Stack>
			<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
				{attribute.name}
			</Typography>
			<RichTextSpan key={attribute.name} data={attribute.note} />
			{getPastMilestones(status, attribute).map((x) => (
				<Box key={x.milestone}>
					<Typography variant="body2" sx={{ display: "inline" }}>
						{x.milestone}:{" "}
					</Typography>
					<RichTextSpan data={x.note} />
					<ItemLinkButton link={x.link} />
				</Box>
			))}
		</Stack>
	);
}
