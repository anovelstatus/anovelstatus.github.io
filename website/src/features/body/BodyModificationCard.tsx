import { Card, CardHeader, CardContent, Stack, Typography } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { useChapter } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import { WrappedRow } from "@/components/WrappedRow";

export type BodyModificationCardProps = {
	mutation: Body.Modification;
};

export function BodyModificationCard({ mutation }: BodyModificationCardProps) {
	const chapter = useChapter();
	return (
		<Card>
			<CardHeader
				title={
					<WrappedRow>
						{mutation.name}
						<ChaptersChip chapters={mutation.chapters} />
						{mutation.tier && <RarityChip name={mutation.tier} />}
					</WrappedRow>
				}
			/>
			<CardContent>
				<Stack>
					<RichTextSpan data={parseNote(mutation, chapter)} />
					<Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
						Source: <RichTextSpan data={mutation.source} />
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
}

function parseNote(mutation: Body.Modification, currentChapter: number): string {
	const note = mutation.note ?? "";
	if (mutation.chapters.length == 1) return note;

	const latestChapter = mutation.chapters.findLast((x) => x <= currentChapter);

	const lines = note.split("\n");
	const prefix = `${latestChapter} - `;
	return lines.find((x) => x.startsWith(prefix))?.replace(prefix, "") ?? note;
}
