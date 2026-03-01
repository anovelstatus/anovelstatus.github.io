import { BloodlineCard, BodyModificationsCard, RaceCard } from "@/features/body";
import { getRaceForChapter } from "@/data/helpers";
import { useBloodlines, useBodyMutations, useChapter, useLoreTopic, useRaces } from "@/data/api";
import { Stack, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";

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

	const cardSize = { xs: 12, md: 6 };

	return (
		<Stack>
			<Typography variant="h3" gutterBottom>
				Priam's Body
			</Typography>
			<Typography variant="body2" gutterBottom whiteSpace="pre-line">
				{bodyLore.description}
			</Typography>
			<Grid container spacing={1}>
				<Grid size={cardSize}>
					<Card>
						<CardHeader title="Tempering" />
						<CardContent>🚧 Under Construction</CardContent>
					</Card>
				</Grid>
				<Grid size={cardSize}>
					<Card>
						<CardHeader title="Race" />
						<CardContent>
							<RaceCard race={race} />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={cardSize}>
					<Card>
						<CardHeader title="Bloodlines" />
						<CardContent>
							<Stack>
								{filteredBloodlines.map((bloodline, index) => (
									<BloodlineCard bloodline={bloodline} key={index} />
								))}
							</Stack>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={cardSize}>
					<BodyModificationsCard mutations={mutations} />
				</Grid>
			</Grid>
		</Stack>
	);
}
