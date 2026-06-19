import { BloodlineCard, BodyModificationCard, RaceCard, TemperingStageCard } from "@/features/body";
import { useChapter } from "@/data/api";
import { Stack, Typography, Grid } from "@mui/material";
import Section from "@/components/Section";
import { LoreSection } from "@/components/LoreSection";
import {
	useBloodlinesOnChapter,
	useBodyMutationsOnChapter,
	useBodyTemperingForChapter,
	useRaceOnChapter,
} from "@/features/body/helpers";

export function BodyPage() {
	const chapter = useChapter();

	const race = useRaceOnChapter(chapter);
	const bloodlines = useBloodlinesOnChapter(chapter);
	const mutations = useBodyMutationsOnChapter(chapter);
	const stages = useBodyTemperingForChapter(chapter);

	const temperingContents = (
		<Stack direction="column" spacing={2}>
			<LoreSection topic="Tempering" />
			{stages.map((x, index) => {
				return <TemperingStageCard key={index} stage={x} />;
			})}
		</Stack>
	);

	const bloodlineContents = (
		<Stack direction="column" spacing={2}>
			<LoreSection topic="Bloodlines" />
			<Grid container spacing={2}>
				{bloodlines.map((bloodline, index) => (
					<Grid key={index} size={{ xs: 12, md: 6 }}>
						<BloodlineCard bloodline={bloodline} />
					</Grid>
				))}
			</Grid>
		</Stack>
	);
	const mutationContents = (
		<Stack direction="column" spacing={2}>
			<LoreSection topic="Mutations" />
			<Grid container spacing={2}>
				{mutations.map((x, index) => {
					return (
						<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
							<BodyModificationCard mutation={x} />
						</Grid>
					);
				})}
			</Grid>
		</Stack>
	);

	return (
		<Stack spacing={2}>
			<Typography variant="h3" gutterBottom>
				Priam's Body & Spirit
			</Typography>
			<LoreSection topic="Body" />
			<Section title="Race">
				<Stack direction="column" spacing={2}>
					<LoreSection topic="Race" />
					<RaceCard race={race} />
				</Stack>
			</Section>
			{bloodlines.length > 0 && <Section title="Bloodlines">{bloodlineContents}</Section>}
			{mutations.length > 0 && <Section title="Modifications & Mutations">{mutationContents}</Section>}
			{stages.length > 0 && <Section title="Tempering">{temperingContents}</Section>}
		</Stack>
	);
}
