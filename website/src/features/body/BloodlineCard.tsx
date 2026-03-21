import { Card, CardHeader, CardContent, CardActions, Stack, Typography, Chip } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { TitleButton } from "../titles";
import { orderBy } from "es-toolkit";
import { useChapter, useLoreTopic } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";

export type BloodlineProps = { bloodline: Bloodline };

export function BloodlineCard({ bloodline }: BloodlineProps) {
	const chapter = useChapter();
	const lore = useLoreTopic(bloodline.lore, chapter);
	// In case there are multiple gains in the same chapter, display the one with the highest purity first
	const updates = orderBy(
		bloodline.updates.filter((x) => x.chapter <= chapter),
		["chapter", (x) => (typeof x.purity === "number" ? x.purity : 0)],
		["desc", "desc"],
	);
	if (!updates || updates.length === 0) {
		return null;
	}
	const latest = updates[0]!;

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						{bloodline.name}, {formatPurity(latest.purity)}
						<Chip label={bloodline.quality} size="small" variant="filled" color="default" />
						<ChaptersChip chapters={[latest.chapter]} />
					</Stack>
				}
			/>
			{latest.title && (
				<CardActions>
					<TitleButton title={latest.title} />
				</CardActions>
			)}
			<CardContent>
				<Stack>
					<Typography variant="h6">Progress</Typography>
					{updates.map((update, index) => (
						<Stack key={index} direction="row" alignItems="center" spacing={1}>
							<ChaptersChip chapters={[update.chapter]} />
							<Typography variant="body2">
								{formatPurity(update.purity)} from <RichTextSpan data={update.note!} />
							</Typography>{" "}
						</Stack>
					))}
				</Stack>
			</CardContent>
			{lore.updates.length > 0 && (
				<CardContent>
					<Stack>
						<Typography variant="h6">Lore</Typography>
						<RichTextSpan data={lore.description} />
						{lore.updates.map((update, index) => (
							<Stack direction="row" key={index}>
								<ChaptersChip chapters={[update.chapter]} />
								<RichTextSpan data={update.note} />
							</Stack>
						))}
					</Stack>
				</CardContent>
			)}
		</Card>
	);
}

function formatPurity(purity: number | string) {
	if (typeof purity === "number") {
		return Math.round(purity * 100) + "%";
	}
	return purity;
}
