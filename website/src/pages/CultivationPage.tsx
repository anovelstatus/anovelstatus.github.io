import { BloodlineCard, BodyModificationsCard, RaceCard } from "@/features/body";
import { getRaceForChapter } from "@/data/helpers";
import { useBody, useChapter } from "@/data/api";
import { Stack, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";
import { TierChip } from "@/components/chips";

export function CultivationPage() {
	const chapter = useChapter();
	const { races, bloodlines, mutations } = useBody();
	const race = getRaceForChapter(races, chapter);

	const cardSize = { xs: 12, md: 6 };

	return (
		<Stack>
			<Typography variant="h3" gutterBottom>
				Priam's Cultivation
			</Typography>
			<Typography variant="h4" gutterBottom>
				Soul
			</Typography>
			<Grid container spacing={1}>
				<Grid size={cardSize}>
					<Card>
						<CardHeader
							title={
								<>
									Soul Tier <TierChip tier={0} />
								</>
							}
						/>
						<CardContent>still a basic T0</CardContent>
						<CardContent>🚧 Under Construction</CardContent>
					</Card>
				</Grid>
				<Grid size={cardSize}>
					<Card>
						<CardHeader title="Concepts" />
						<CardContent>🚧 Under Construction</CardContent>
					</Card>
				</Grid>
				<Grid size={cardSize}>
					<Card>
						<CardHeader title="Supremacies" />
						<CardContent>Micro, Domain, Mastery</CardContent>
						<CardContent>🚧 Under Construction</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Typography variant="h4" gutterBottom>
				Mind
			</Typography>
			<Grid container spacing={1}>
				<Grid size={cardSize}>
					<Card>
						<CardHeader title="Mind Ennoblement" />
						<CardContent>🚧 Under Construction</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Typography variant="h4" gutterBottom>
				Body
			</Typography>
			<Grid container spacing={1}>
				<Grid size={cardSize}>
					<Card>
						<CardHeader title="Tempering" />
						<CardContent>🚧 Under Construction</CardContent>
					</Card>
				</Grid>
				<Grid size={cardSize}>
					<RaceCard race={race} />
				</Grid>
				<Grid size={cardSize}>
					<BloodlineCard bloodlines={bloodlines} />
				</Grid>
				<Grid size={cardSize}>
					<BodyModificationsCard mutations={mutations} />
				</Grid>
			</Grid>
		</Stack>
	);
}
