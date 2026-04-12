import { Card, CardHeader, CardContent, Stack, Typography } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { useChapter } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";

export type BodyModificationCardProps = {
	mutation: Body.Modification;
};

export function BodyModificationCard({ mutation }: BodyModificationCardProps) {
	const chapter = useChapter();
	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" sx={{ alignItems: "center" }}>
						{mutation.name}
						<ChaptersChip chapters={mutation.chapters} />
					</Stack>
				}
			/>
			<CardContent>
				<Stack>
					<Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
						<RichTextSpan data={parseNote(mutation, chapter)} />
					</Typography>
					<Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
						Source: <RichTextSpan data={mutation.source} />
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
}

function parseNote(mutation: Body.Modification, currentChapter: number): string {
	if (mutation.chapters.length == 1) return mutation.note;

	const latestChapter = mutation.chapters.findLast((x) => x <= currentChapter);

	const lines = mutation.note.split("\n");
	const prefix = `${latestChapter} - `;
	return lines.find((x) => x.startsWith(prefix))?.replace(prefix, "") ?? mutation.note;
}
