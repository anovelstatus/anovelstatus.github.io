import { BloodlineCard, BodyModificationCard, RaceCard, TemperingStageCard } from "@/features/body";
import {
	useBloodlinesOnChapter,
	useBodyMutationsOnChapter,
	useBodyTemperingForChapter,
	useChapter,
	useLoreTopic,
	useRaceOnChapter,
} from "@/data/api";
import { Stack, Typography, Grid } from "@mui/material";
import { RichTextSpan } from "@/components/RichTextSpan";
import Section from "@/components/Section";

export function BodyPage() {
	const chapter = useChapter();

	const bodyLore = useLoreTopic("Body", chapter);
	const race = useRaceOnChapter(chapter);
	const bloodlines = useBloodlinesOnChapter(chapter);
	const mutations = useBodyMutationsOnChapter(chapter);
	const stages = useBodyTemperingForChapter(chapter);

	const temperingContents = (
		<Stack direction="column" spacing={2}>
			{stages.map((x, index) => {
				return <TemperingStageCard key={index} stage={x} />;
			})}
		</Stack>
	);

	const bloodlineContents = (
		<Grid container spacing={2}>
			{bloodlines.map((bloodline, index) => (
				<Grid key={index} size={{ xs: 12, md: 6 }}>
					<BloodlineCard bloodline={bloodline} />
				</Grid>
			))}
		</Grid>
	);
	const mutationContents = (
		<Grid container spacing={2}>
			{mutations.map((x, index) => {
				return (
					<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
						<BodyModificationCard mutation={x} />
					</Grid>
				);
			})}
		</Grid>
	);

	return (
		<Stack spacing={2}>
			<Typography variant="h3" gutterBottom>
				Priam's Body
			</Typography>
			<RichTextSpan data={bodyLore.description} />
			<Section title="Race" contents={<RaceCard race={race} />} />
			{bloodlines.length > 0 && <Section title="Bloodlines" contents={bloodlineContents} />}
			{mutations.length > 0 && <Section title="Modifications & Mutations" contents={mutationContents} />}
			{stages.length > 0 && <Section title="Tempering" contents={temperingContents} />}
		</Stack>
	);
}
