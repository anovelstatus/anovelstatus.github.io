import { Card, CardHeader, CardContent, CardActions, Stack, Typography } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { useBloodlines, useChapter } from "@/data/api";
import { TitleButton } from "../titles";
import { orderBy } from "es-toolkit";

type BloodlineProps = { bloodline: Bloodline };

function BloodlineCard({ bloodline }: BloodlineProps) {
	if (!bloodline.updates || bloodline.updates.length === 0) {
		return null;
	}
	// In case there are multiple gains in the same chapter, display the one with the highest purity first
	const updates = orderBy(
		bloodline.updates,
		["chapter", (x) => (typeof x.purity === "number" ? x.purity : 0)],
		["desc", "desc"],
	);
	const latest = updates[0]!;

	return (
		<Card variant="outlined">
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						{bloodline.name}, {formatPurity(latest.purity)}
						<ChaptersChip chapters={[latest.chapter]} />
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
		</Card>
	);
}

export default function BloodlinesCard() {
	const chapter = useChapter();
	const bloodlines = useBloodlines();

	const filteredBloodlines: Bloodline[] = bloodlines
		.map((x) => {
			return {
				...x,
				updates: x.updates.filter((y) => y.chapter <= chapter),
			};
		})
		.filter((x) => x.updates.length > 0);
	const cards = filteredBloodlines.map((bloodline, index) => <BloodlineCard bloodline={bloodline} key={index} />);

	return (
		<Card>
			<CardHeader title="Bloodlines" />
			<CardContent>
				<Stack>{cards}</Stack>
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
