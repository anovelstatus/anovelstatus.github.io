import { Card, CardHeader, CardContent, Stack, Typography, Chip, Grid } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { useBodyTempering, useChapter, useLoreTopic } from "@/data/api";
import { orderBy } from "es-toolkit";
import { RichTextSpan } from "@/components/RichTextSpan";
import { SkillButton } from "../skills";
import { TitleButton } from "../titles";

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

	const lore = useLoreTopic("Tempering - " + stage.name, chapter);

	const completedSteps = stage.updates.filter((x) => x.completed && x.completed <= chapter);
	const startedSteps = stage.updates.filter((x) => x.started <= chapter);
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
					{lore.description && (
						<Typography variant="body2" whiteSpace="pre-line">
							<RichTextSpan data={lore.description} />
						</Typography>
					)}
					{lore.updates.map((update, index) => (
						<Stack direction="row" key={index}>
							<Typography variant="body2" whiteSpace="pre-line">
								<RichTextSpan data={update.note2} />
							</Typography>
						</Stack>
					))}
					<Typography variant="h6">Steps</Typography>
					<Grid container spacing={2}>
						{startedSteps.map((x, index) => {
							const isCompleted = x.completed && x.completed <= chapter;
							const chapters = isCompleted ? [x.started, x.completed!] : [x.started];
							return (
								<Grid key={index} direction="column" alignItems="center" size={{ xs: 12, sm: 6, md: 4 }} spacing={2}>
									<Stack direction="row" alignItems="flex-start" justifyItems="baseline" spacing={1}>
										<ChaptersChip chapters={chapters} />
										<Stack direction="column" spacing={1}>
											<Typography
												variant="body2"
												color={isCompleted ? "text.primary" : "text.secondary"}
												whiteSpace="pre-line"
											>
												<RichTextSpan data={x.note} />
											</Typography>
											{x.link && x.linkType == "Skill" && <SkillButton skill={x.link} />}
											{x.link && x.linkType == "Title" && <TitleButton title={x.link} />}
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
