import { Card, CardHeader, CardContent, Stack, Grid, Typography } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { sameId } from "@/data/helpers";
import { useTitles } from "@/data/api";
import { getPreviousTitle } from "./helpers";
import LoadingCard from "@/components/LoadingCard";
import TitleButton from "./TitleButton";
import { RichTextSpan } from "@/components/RichTextSpan";

type TitleCardProps = { id: TieredId } & PropsWithStyle;

export default function TitleCard({ id, sx }: TitleCardProps) {
	const { data: titles } = useTitles();
	const title = titles.find((x) => sameId(x, id));

	if (!title) return <LoadingCard headerOnly sx={sx} />;

	const previousTitle = getPreviousTitle(titles, title);

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Grid container spacing={1} alignItems="center">
						{title.name} <RarityChip name={title.tier} />
						<ChaptersChip chapters={title.chapter} />
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					<Typography variant="body2" whiteSpace="pre-line">
						<RichTextSpan data={title.note} />
					</Typography>
					{previousTitle ? <TitleButton title={previousTitle} /> : null}
				</Stack>
			</CardContent>
		</Card>
	);
}
