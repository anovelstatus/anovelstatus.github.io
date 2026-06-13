import { ChaptersChip } from "@/components/chips";
import { LoreSection } from "@/components/LoreSection";
import { RichTextSpan } from "@/components/RichTextSpan";
import { useChapter } from "@/data/api";
import { Card, CardHeader, CardContent, Stack, Typography } from "@mui/material";
import { groupBy, sortBy } from "es-toolkit";
import { useMemo } from "react";

type SupremacyCardProps = {
	name: string;
	stages: SupremacyStage[];
};

export function SupremacyCard({ name, stages }: SupremacyCardProps) {
	const chapter = useChapter();
	const groupedByStage = useMemo(() => getStagesForChapter(chapter, stages), [chapter, stages]);

	if (!groupedByStage.length) return <></>;

	return (
		<Card>
			<CardHeader title={name} />
			<CardContent>
				<LoreSection topic={name} />
			</CardContent>
			<CardContent>
				<Stack>
					{groupedByStage.map((group) => {
						const stage = group[group.length - 1]!;
						// Later chapters reworded earlier stages.
						const originalChapter = group[0]?.chapter ?? stage?.chapter;
						return (
							<Stack key={name + "-" + stage.stage}>
								<Stack direction="row" sx={{ alignItems: "center" }}>
									<Typography variant="h6">{stage.stage >= 0 ? `Stage ${stage.stage}` : "Glimpse"}</Typography>
									<ChaptersChip chapters={originalChapter} />
								</Stack>
								<RichTextSpan data={stage.note} />
							</Stack>
						);
					})}
				</Stack>
			</CardContent>
		</Card>
	);
}

export function getStagesForChapter(chapter: number, allStages: SupremacyStage[]): SupremacyStage[][] {
	// Make sure it's sorted by stage and chapter, and hide future content
	const currentStages = sortBy(
		allStages.filter((x) => x.chapter <= chapter),
		[(x) => x.stage, (x) => x.chapter],
	);
	// Group records by stage, so we can use the original chapter but show the latest note
	const grouped = groupBy(currentStages, (x) => x.stage);
	const achieved = Object.keys(grouped)
		.map((x) => parseInt(x))
		.toSorted();
	return achieved.map((x) => grouped[x]!);
}
