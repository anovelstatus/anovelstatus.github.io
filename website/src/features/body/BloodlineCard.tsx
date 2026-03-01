import { Card, CardHeader, CardContent, CardActions, Stack, Typography, Chip } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { TitleButton } from "../titles";
import { orderBy } from "es-toolkit";
import { useChapter, useLoreTopic } from "@/data/api";

export type BloodlineProps = { bloodline: Bloodline };

export default function BloodlineCard({ bloodline }: BloodlineProps) {
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
		<Card variant="outlined">
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						{bloodline.name}, {formatPurity(latest.purity)}
						<ChaptersChip chapters={[latest.chapter]} />
						<Chip label={bloodline.quality} size="small" variant="filled" color="default" />
					</Stack>
				}
			/>
			<CardActions>
				<TitleButton title={bloodline.title} />
			</CardActions>
			<CardContent>
				<Stack>
					<Typography variant="h6">Progress</Typography>
					{updates.map((update, index) => (
						<Stack key={index} direction="row" alignItems="center" spacing={1}>
							<Typography variant="body2">
								{formatPurity(update.purity)} from {update.note}
							</Typography>{" "}
							<ChaptersChip chapters={[update.chapter]} />
						</Stack>
					))}
				</Stack>
			</CardContent>
			<CardContent>
				<Stack>
					<Typography variant="h6">Lore</Typography>
					<Typography variant="body2" whiteSpace="pre-line">
						{lore.description}
					</Typography>
					{lore.updates.map((update, index) => (
						<Stack direction="column" key={index}>
							<ChaptersChip chapters={[update.chapter]} />
							<Typography key={index} variant="body2" whiteSpace="pre-line">
								{update.note}
							</Typography>
						</Stack>
					))}
				</Stack>
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
