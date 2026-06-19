import { Card, CardHeader, CardContent, Stack, Typography } from "@mui/material";
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
					<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
						{title.name} <RarityChip name={title.tier} />
						<ChaptersChip chapters={title.chapter} />
					</Stack>
				}
			/>
			<CardContent>
				<Stack>
					<RichTextSpan data={title.note} />
					{previousTitle && (
						<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
							<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
								Previous:
							</Typography>
							<TitleButton item={previousTitle} />
						</Stack>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}
