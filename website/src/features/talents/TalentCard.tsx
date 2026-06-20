import { Card, CardHeader, CardContent, Stack, Typography, CardActions } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { findByIds, sameId } from "@/data/helpers";
import { useTalents } from "@/data/api";
import LoadingCard from "@/components/LoadingCard";
import { RichTextSpan } from "@/components/RichTextSpan";
import TalentButton from "./TalentButton";
import type { PropsWithStyle } from "@/types";

export type TalentCardProps = { id: TieredId } & PropsWithStyle;

export default function TalentCard({ id, sx }: TalentCardProps) {
	const { data: talents } = useTalents();
	const talent = talents.find((x) => sameId(x, id));

	const previousTalents = findByIds(talents, talent?.previous);
	const previousCount = previousTalents.length;

	if (!talent) return <LoadingCard headerOnly sx={sx} />;

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
						{talent.name} <RarityChip name={talent.tier} />
						<ChaptersChip chapters={[talent.chapterGained]} />
					</Stack>
				}
			/>
			<CardContent>
				<RichTextSpan data={talent.note} />
			</CardContent>
			{previousCount ? (
				<CardActions>
					<Stack>
						<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
							Previous:
						</Typography>
						<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center" }}>
							{previousTalents.map((x, index) => (
								<TalentButton key={index} item={x} />
							))}
						</Stack>
					</Stack>
				</CardActions>
			) : null}
		</Card>
	);
}
