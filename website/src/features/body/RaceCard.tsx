import { toIdString } from "@/data/helpers";
import { Card, CardHeader, CardContent, Box, Stack, Typography } from "@mui/material";
import { ChaptersChip, TierChip } from "@/components/chips";
import { TalentCard } from "@/features/talents";
import TieredButton from "@/components/TieredButton";
import { PopoverButton } from "@/components/PopoverButton";
import LoadingCard from "@/components/LoadingCard";

type RaceCardProps = {
	race?: Race;
};

export default function RaceCard({ race }: RaceCardProps) {
	const isLoading = !race;
	const talents = race?.talents ?? [];

	if (isLoading) return <LoadingCard />;

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						<Box>Current Race: {race.name}</Box>
						<TierChip tier={race.tier} />
						<ChaptersChip chapters={[race.chapter]} />
					</Stack>
				}
			/>
			<CardContent>
				{
					<Typography variant="body2" fontStyle="italic">
						{race.note}
					</Typography>
				}
			</CardContent>
			{
				<CardContent>
					<Typography variant="h6">Talent{talents.length > 1 ? "s" : ""}:</Typography>
					<Stack direction="row">
						{talents.map((id, index) => (
							<PopoverButton
								key={index}
								id={toIdString(id)}
								trigger={<TieredButton item={id} variant="outlined" />}
								popover={() => <TalentCard key={index} id={id} sx={{ maxWidth: 500 }} />}
							/>
						))}
					</Stack>
				</CardContent>
			}
		</Card>
	);
}
