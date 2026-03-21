import { Card, CardHeader, CardContent, Box, Stack, Typography, Button } from "@mui/material";
import { ChaptersChip, TierChip } from "@/components/chips";
import { PopoverButton } from "@/components/PopoverButton";
import LoadingCard from "@/components/LoadingCard";
import { popupCardStyles } from "@/styles";
import { useRaces } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import TalentButton from "../talents/TalentButton";

export type RaceCardProps = {
	race?: Race;
} & PropsWithStyle;

export function RaceCard({ race, sx }: RaceCardProps) {
	const isLoading = !race;
	const talents = race?.talents ?? [];
	const races = useRaces();

	if (isLoading) return <LoadingCard />;

	const previousRace = races.find((x) => x.chapter < race.chapter || x.tier < race.tier);

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						<Box>{race.name}</Box>
						<TierChip tier={race.tier} />
						<ChaptersChip chapters={[race.chapter]} />
					</Stack>
				}
			/>
			<CardContent>
				<RichTextSpan data={race.note} />
			</CardContent>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Talent{talents.length > 1 ? "s" : ""}:
				</Typography>
				<Stack direction="row" spacing={1} flexWrap="wrap">
					{talents.map((id, index) => (
						<TalentButton key={index} item={id} />
					))}
				</Stack>
			</CardContent>
			{previousRace && (
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Previous Race:
					</Typography>
					<PopoverButton
						id={previousRace.name + previousRace.tier}
						trigger={<Button variant="outlined">{previousRace.name}</Button>}
						popover={() => <RaceCard race={previousRace} sx={popupCardStyles} />}
					/>
				</CardContent>
			)}
		</Card>
	);
}
