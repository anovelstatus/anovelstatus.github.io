import { Card, CardHeader, CardContent, Box, Stack, Typography, Grid, CardActions } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { findByIds, sameId, toIdString } from "@/data/helpers";
import { useTalents } from "@/data/api";
import RarityButton from "@/components/TieredButton";
import { PopoverButton } from "@/components/PopoverButton";
import LoadingCard from "@/components/LoadingCard";

export type TalentCardProps = { id: TieredId } & PropsWithStyle;

export default function TalentCard({ id, sx }: TalentCardProps) {
	const { data: talents } = useTalents();
	const talent = talents.find((x) => sameId(x, id));

	const previousTalents = findByIds(talents, talent?.previous);
	const previousCount = previousTalents.length;

	if (!talent) return <LoadingCard headerOnly />;

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Grid container spacing={1} alignItems="center">
						{talent.name} <RarityChip name={talent.tier} />
						<ChaptersChip chapters={[talent.chapterGained]} />
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					<Typography variant="body2" fontStyle="italic">
						{talent.note}
					</Typography>
					{previousCount ? <Box sx={{ marginTop: "20px" }}>Previous Talent{previousCount > 1 ? "s" : ""}:</Box> : <></>}
				</Stack>
			</CardContent>
			{previousCount ? (
				<CardActions>
					{previousTalents.map((x, index) => {
						return (
							<PopoverButton
								key={index}
								id={toIdString(x)}
								trigger={<RarityButton item={x} variant="outlined" />}
								popover={() => <TalentCard id={x} sx={{ maxWidth: 500 }} />}
							/>
						);
					})}
				</CardActions>
			) : null}
		</Card>
	);
}
