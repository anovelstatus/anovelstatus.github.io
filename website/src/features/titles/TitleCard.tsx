import { Card, CardHeader, CardContent, Stack, Typography } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { sameId } from "@/data/helpers";
import { useTitles } from "@/data/api";
import { getPreviousTitle } from "./helpers";
import LoadingCard from "@/components/LoadingCard";
import TitleButton from "./TitleButton";
import { RichTextSpan } from "@/components/RichTextSpan";
import type { PropsWithStyle } from "@/types";
import { WrappedRow } from "@/components/WrappedRow";

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
					<WrappedRow>
						{title.name} <RarityChip name={title.tier} />
						<ChaptersChip chapters={title.chapter} />
					</WrappedRow>
				}
			/>
			<CardContent>
				<Stack>
					<RichTextSpan data={title.note} />
					{previousTitle && (
						<WrappedRow>
							<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
								Previous:
							</Typography>
							<TitleButton item={previousTitle} />
						</WrappedRow>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}
