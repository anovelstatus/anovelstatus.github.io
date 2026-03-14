import { Card, CardHeader, CardContent, Stack, Typography, Grid } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { useChapter } from "@/data/api";
import { orderBy } from "es-toolkit";

type BodyModificationsCardProps = {
	mutations: Body.Modification[];
};

export default function BodyModificationsCard({ mutations }: BodyModificationsCardProps) {
	const chapter = useChapter();
	const filteredMutations = mutations?.filter((x) => x.chapters.some((ch) => ch <= chapter));
	if (!filteredMutations?.length) return <></>;

	const sorted = orderBy(filteredMutations, [(x) => x.chapters[0]], ["asc"]);

	return (
		<Card>
			<CardHeader title="Modifications & Mutations" />
			<CardContent>
				<Grid container spacing={2}>
					{sorted.map((x, index) => {
						return (
							<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
								<BodyModificationCard modification={x} />
							</Grid>
						);
					})}
				</Grid>
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

function BodyModificationCard({ modification }: { modification: Body.Modification }) {
	const chapter = useChapter();
	return (
		<Card variant="outlined">
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						{modification.name}
						<ChaptersChip chapters={modification.chapters} />
					</Stack>
				}
			/>
			<CardContent>
				<Stack>
					<Typography variant="caption">{parseNote(modification, chapter)}</Typography>
					<Typography variant="caption">Source: {modification.source}</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
}
