import { Card, CardHeader, CardContent, Stack, Typography } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { useChapter } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";

export type HighTribulationProps = { updates: HighTribulationUpdate[] };

export function HighTribulationCard({ updates }: HighTribulationProps) {
	const chapter = useChapter();
	const filtered = updates.filter((x) => x.chapter <= chapter);
	if (!filtered.length) return <></>;
	const tier = filtered[0]!.tier;
	const suffix = filtered.some((x) => x.done) ? " (complete)" : " (in progress)";

	return (
		<Card>
			<CardHeader title={"Tier " + tier + suffix} />
			<CardContent>
				<Stack>
					{filtered.map((update, index) => (
						<Stack key={index} direction="row" spacing={1}>
							<ChaptersChip chapters={[update.chapter]} />
							<Typography variant="body2">
								<RichTextSpan data={update.note} />
							</Typography>{" "}
						</Stack>
					))}
				</Stack>
			</CardContent>
		</Card>
	);
}
