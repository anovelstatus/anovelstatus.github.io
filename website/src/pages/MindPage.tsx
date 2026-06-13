import { LoreSection } from "@/components/LoreSection";
import Section from "@/components/Section";
import { useTalentGroups } from "@/features/talents";
import TalentButton from "@/features/talents/TalentButton";
import { Stack, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";

export function MindPage() {
	const cardSize = { xs: 12, md: 6 };
	const talents = useTalentGroups();
	const mindTalent = talents["Mind Ennoblement"]?.[0];

	return (
		<Stack>
			<Typography variant="h3" gutterBottom>
				Priam's Mind
			</Typography>
			<LoreSection topic="Mind" />
			<Section
				title={
					<Stack direction="row">
						Mind Ennoblement
						{mindTalent && <TalentButton item={mindTalent} />}
					</Stack>
				}
			>
				<Stack>
					<LoreSection topic="Mind Ennoblement" />
					<Grid container spacing={1}>
						<Grid size={cardSize}>
							<Card>
								<CardHeader title="🚧 Under Construction" />
								<CardContent>
									<Stack></Stack>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Stack>
			</Section>
		</Stack>
	);
}
