import { Card, CardHeader, CardContent, CardActions, Stack, Typography, Chip } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { TitleButton } from "@/features/titles";
import { orderBy } from "es-toolkit";
import { useChapter } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import { LoreSection } from "@/components/LoreSection";
import { useMemo } from "react";

export type BloodlineProps = { bloodline: Bloodline } & PropsWithStyle;

export function BloodlineCard({ bloodline, sx }: BloodlineProps) {
	const chapter = useChapter();
	// In case there are multiple gains in the same chapter, display the one with the highest purity first
	const updates = useMemo(() => {
		return orderBy(
			bloodline.updates.filter((x) => x.chapter <= chapter),
			["chapter", (x) => (typeof x.purity === "number" ? x.purity : 0)],
			["desc", "desc"],
		);
	}, [bloodline, chapter]);
	if (!updates || updates.length === 0) {
		return null;
	}
	const latest = updates[0]!;

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Stack direction="row" sx={{ alignItems: "center" }}>
						{bloodline.name}, {formatPurity(latest.purity)}
						<Chip label={bloodline.quality} size="small" variant="filled" color="default" />
						<ChaptersChip chapters={[latest.chapter]} />
					</Stack>
				}
			/>
			{latest.title && (
				<CardActions>
					<TitleButton item={latest.title} />
				</CardActions>
			)}
			<CardContent>
				<Stack>
					<Typography variant="h6">Progress</Typography>
					{updates.map((update, index) => (
						<Stack key={index} direction="row" sx={{ alignItems: "center" }} spacing={1}>
							<ChaptersChip chapters={[update.chapter]} />
							<Typography variant="body2">
								{formatPurity(update.purity)} from <RichTextSpan data={update.note} />
							</Typography>{" "}
						</Stack>
					))}
				</Stack>
			</CardContent>
			<CardContent>
				<Typography variant="h6">Other Information</Typography>
				<LoreSection topic={bloodline.lore} />
			</CardContent>
		</Card>
	);
}

function formatPurity(purity: number | string) {
	if (typeof purity === "number") {
		return Math.round(purity * 100) + "%";
	}
	return purity;
}
