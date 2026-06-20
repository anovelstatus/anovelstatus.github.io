import { Card, CardHeader, CardContent, Stack, Typography, Chip, Grid } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { useChapter } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import { LoreSection } from "@/components/LoreSection";
import { ItemLinkButton } from "@/components/ItemLinkButton";

export function TemperingStageCard({ stage }: { stage: TemperingStage }) {
	const chapter = useChapter();

	const completedSteps = stage.updates.filter((x) => x.completed && x.completed <= chapter);
	const startedSteps = stage.updates.filter((x) => x.started <= chapter);
	const stepsTotal = `${completedSteps.length} / ${stage.expectedSteps} steps completed`;
	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" sx={{ alignItems: "center" }}>
						{stage.name} <RarityChip name={stage.tier} />
						<ChaptersChip chapters={stage.chapter} />
						<Chip size="small" label={stepsTotal} />
					</Stack>
				}
			/>
			<CardContent>
				<Stack>
					<RichTextSpan data={stage.description} />
					<LoreSection topic="Tempering" subtopic={stage.name} />
					<Typography variant="h6">Steps</Typography>
					<Grid container spacing={2}>
						{startedSteps.map((x, index) => {
							const isCompleted = x.completed && x.completed <= chapter;
							const chapters = isCompleted ? [x.started, x.completed!] : [x.started];
							return (
								<Grid key={index} sx={{ alignItems: "center" }} size={{ xs: 12, sm: 6, md: 4 }} spacing={2}>
									<Stack direction="row" sx={{ alignItems: "flex-start", justifyItems: "baseline" }} spacing={1}>
										<ChaptersChip chapters={chapters} />
										<Stack direction="column" spacing={1}>
											<RichTextSpan data={x.note} color={isCompleted ? "text.primary" : "text.secondary"} />
											<ItemLinkButton link={x.link} />
										</Stack>
									</Stack>
								</Grid>
							);
						})}
					</Grid>
				</Stack>
			</CardContent>
		</Card>
	);
}
