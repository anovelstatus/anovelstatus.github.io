import { Card, CardHeader, CardContent, Stack, Typography, Chip } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { useBodyTempering, useChapter } from "@/data/api";
import { orderBy } from "es-toolkit";

export default function TemperingSection() {
	const chapter = useChapter();
	const stages = useBodyTempering();

	const filteredStages = stages?.filter((x) => x.chapter <= chapter);
	if (!filteredStages?.length) return <></>;

	const sorted = orderBy(filteredStages, [(x) => x.chapter], ["asc"]);

	return (
		<Card>
			<CardHeader title="Tempering" />
			<CardContent>
				<Stack direction="column" spacing={2}>
					{sorted.map((x, index) => {
						return <TemperingStageCard key={index} stage={x} />;
					})}
				</Stack>
			</CardContent>
		</Card>
	);
}

function TemperingStageCard({ stage }: { stage: TemperingStage }) {
	const chapter = useChapter();

	const completedSteps = stage.updates.filter((x) => x.completed && x.completed <= chapter);
	const stepsTotal = `${completedSteps.length} / ${stage.expectedSteps} steps completed`;
	return (
		<Card variant="outlined">
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						{stage.name} <RarityChip name={stage.tier} />
						<ChaptersChip chapters={stage.chapter} />
						<Chip size="small" label={stepsTotal} />
					</Stack>
				}
			/>
			<CardContent>
				<Stack>
					<Typography variant="caption">{stage.description}</Typography>
				</Stack>
			</CardContent>
			<CardContent>🚧 Under Construction</CardContent>
		</Card>
	);
}
