import { Card, CardHeader, CardContent, Stack, Grid, Typography } from "@mui/material";
import { RarityChip } from "@/components/chips";
import { sameId, toIdString } from "@/data/helpers";
import { useTitles } from "@/data/api";
import RarityButton from "@/components/TieredButton";
import { getPreviousTitle } from "./helpers";
import { PopoverButton } from "@/components/PopoverButton";
import LoadingCard from "@/components/LoadingCard";

type TitleCardProps = { id: TieredId } & PropsWithStyle;

export default function TitleCard({ id, sx }: TitleCardProps) {
	const { data: titles } = useTitles();
	const title = titles.find((x) => sameId(x, id));

	if (!title) return <LoadingCard headerOnly />;

	const previousTitle = getPreviousTitle(titles, title);

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Grid container spacing={1} alignItems="center">
						{title.name} <RarityChip name={title.tier} />
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					<Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
						{title.note}
					</Typography>
					{previousTitle ? (
						<PopoverButton
							id={toIdString(previousTitle)}
							trigger={<RarityButton item={previousTitle} variant="outlined" />}
							popover={() => <TitleCard id={previousTitle} sx={{ maxWidth: 500 }} />}
						/>
					) : null}
				</Stack>
			</CardContent>
		</Card>
	);
}
