import { Stack, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";
import { TierChip } from "@/components/chips";
import { LoreSection } from "@/components/LoreSection";
import Section from "@/components/Section";
import { useSoul } from "@/data/api";
import { SupremacyCard } from "@/features/soul/SupremacyCard";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";

export function SoulPage() {
	const cardSize = { xs: 12, md: 6 };
	const { data: soul, isFetching } = useSoul();

	// remove ? and || once API is up
	const supremacies = Object.keys(soul?.supremacies || {}).toSorted();

	return (
		<Stack>
			<Typography variant="h3" gutterBottom>
				Priam's Soul <TierChip tier={0} />
			</Typography>
			<LoreSection topic="Soul" />
			<Section
				title={
					<>
						Soul Tier <TierChip tier={0} />
					</>
				}
			>
				<Grid container spacing={1}>
					<Grid size={cardSize}>
						<Card>
							<CardHeader title="High Tribulation" />
							<CardContent>
								<LoreSection topic="High Tribulation" />
							</CardContent>
							<CardContent>🚧 Under Construction</CardContent>
						</Card>
					</Grid>
					<Grid size={cardSize}>
						<Card>
							<CardHeader title="Nirvana" />
							<CardContent>
								<LoreSection topic="Nirvana" />
							</CardContent>
						</Card>
					</Grid>
					<Grid size={cardSize}>
						<Card>
							<CardHeader title="Grace" />
							<CardContent>
								<LoreSection topic="Grace" />
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Section>
			<Section title="Concepts">
				<Stack direction="column" spacing={2}>
					<LoreSection topic="Concept" />
					<Grid container spacing={1}>
						<Grid size={cardSize}>
							<Card>
								<CardHeader title="Concept 1" />
								<CardContent>🚧 Under Construction</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Stack>
			</Section>
			<Section title="Heart Supremacies">
				<Stack direction="column" spacing={2}>
					{isFetching && <LoadingPlaceholder />}
					<LoreSection topic="Heart Supremacies" />
					<Grid container spacing={1}>
						{supremacies.map((supremacy) => (
							<Grid size={cardSize} key={supremacy}>
								<SupremacyCard name={supremacy} stages={soul.supremacies[supremacy]!} />
							</Grid>
						))}
					</Grid>
				</Stack>
			</Section>
		</Stack>
	);
}
