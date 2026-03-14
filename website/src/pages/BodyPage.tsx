import { BloodlineCard, BodyModificationsCard, RaceCard } from "@/features/body";
import { getRaceForChapter } from "@/data/helpers";
import { useBloodlines, useBodyMutations, useChapter, useLoreTopic, useRaces } from "@/data/api";
import { Stack, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";
import TemperingSection from "@/features/body/TemperingSection";

export function BodyPage() {
	const chapter = useChapter();
	const races = useRaces();
	const mutations = useBodyMutations();

	const race = getRaceForChapter(races, chapter);
	const bloodlines = useBloodlines();
	const filteredBloodlines: Bloodline[] = bloodlines
		.map((x) => {
			return {
				...x,
				updates: x.updates.filter((y) => y.chapter <= chapter),
			};
		})
		.filter((x) => x.updates.length > 0);

	const bodyLore = useLoreTopic("Body", chapter);

	return (
		<Stack>
			<Typography variant="h3" gutterBottom>
				Priam's Body
			</Typography>
			<Typography variant="body2" gutterBottom whiteSpace="pre-line">
				{bodyLore.description}
			</Typography>
			<Card>
				<CardHeader title="Race" />
				<CardContent>
					<RaceCard race={race} />
				</CardContent>
			</Card>
			{filteredBloodlines.length > 0 && (
				<Card>
					<CardHeader title="Bloodlines" />
					<CardContent>
						<Grid container spacing={2}>
							{filteredBloodlines.map((bloodline, index) => (
								<Grid key={index} size={{ xs: 12, md: 6 }}>
									<BloodlineCard bloodline={bloodline} />
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>
			)}
			<BodyModificationsCard mutations={mutations} />
			<TemperingSection />
		</Stack>
	);
}
