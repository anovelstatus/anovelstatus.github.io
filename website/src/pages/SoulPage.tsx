import { Stack, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";
import { TierChip } from "@/components/chips";
import { LoreSection } from "@/components/LoreSection";
import Section from "@/components/Section";
import { useChapter, useSoul } from "@/data/api";
import { SupremacyCard } from "@/features/soul/SupremacyCard";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { useSoulTierOnChapter } from "@/features/soul/helpers";
import { groupBy, uniqBy } from "es-toolkit";
import { HighTribulationCard } from "@/features/soul/HighTribulationCard";

export function SoulPage() {
	const chapter = useChapter();
	const cardSize = { xs: 12, md: 6 };
	const { data: soul, isLoading } = useSoul();
	const soulTier = useSoulTierOnChapter(chapter);

	const highTribs = groupBy(soul.highTribulations, (x) => x.tier);
	const tribTiers = uniqBy(soul.highTribulations, (x) => x.tier)
		.map((x) => x.tier)
		.toSorted();
	const supremacies = Object.keys(soul.supremacies).toSorted();

	return (
		<Stack>
			<Typography variant="h3" gutterBottom>
				Priam's Soul <TierChip tier={soulTier} />
			</Typography>
			<LoreSection topic="Soul" />
			<Section title="High Tribulations">
				<LoreSection topic="High Tribulation" />
				<Grid container spacing={1}>
					{tribTiers.map((i) => {
						return (
							<Grid size={cardSize} key={i}>
								<HighTribulationCard updates={highTribs[i] || []} />
							</Grid>
						);
					})}
				</Grid>
			</Section>
			<Section title="Nirvana">
				<LoreSection topic="Nirvana" />
			</Section>
			<Section title="Heart Supremacies">
				<Stack direction="column" spacing={2}>
					{isLoading && <LoadingPlaceholder />}
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
		</Stack>
	);
}
