import { Card, CardHeader, CardContent, Stack, Typography, Chip, Grid } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { useChapter } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import { LoreSection } from "@/components/LoreSection";
import { ItemLinkButton } from "@/components/ItemLinkButton";
import { WrappedRow } from "@/components/WrappedRow";

type StageProps = { stage: TemperingStage };
type StepProps = { step: TemperingStep };

export function TemperingStageCard({ stage }: StageProps) {
	const chapter = useChapter();

	const completedSteps = stage.updates.filter((x) => x.completed && x.completed <= chapter);
	const stepsTotal = `${completedSteps.length} / ${stage.expectedSteps} steps completed`;
	return (
		<Card>
			<CardHeader
				title={
					<WrappedRow>
						{stage.name} <RarityChip name={stage.tier} />
						<ChaptersChip chapters={stage.chapter} />
						<Chip size="small" label={stepsTotal} />
					</WrappedRow>
				}
			/>
			<CardContent>
				<Stack>
					<RichTextSpan data={stage.description} />
					<LoreSection topic="Tempering" subtopic={stage.name} />
					<Typography variant="h6">Steps</Typography>
					<Grid container spacing={2}>
						{stage.updates.map((x, index) => (
							<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }} spacing={2}>
								<TemperingStepSection step={x} />
							</Grid>
						))}
					</Grid>
				</Stack>
			</CardContent>
		</Card>
	);
}

function TemperingStepSection({ step }: StepProps) {
	const chapter = useChapter();

	if (step.started > chapter) return null;
	const isCompleted = step.completed && step.completed <= chapter;
	const chapters = isCompleted ? [step.started, step.completed!] : [step.started];
	return (
		<Stack direction="row" sx={{ alignItems: "flex-start", justifyItems: "baseline" }} spacing={1}>
			<ChaptersChip chapters={chapters} range />
			<Stack direction="column" spacing={1}>
				{!isCompleted && (
					<Typography color="error" variant="body2" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
						In Progress
					</Typography>
				)}
				<RichTextSpan data={step.note} color={isCompleted ? "textPrimary" : "textSecondary"} />
				<ItemLinkButton link={step.link} />
			</Stack>
		</Stack>
	);
}
