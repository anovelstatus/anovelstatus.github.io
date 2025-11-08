import { Card, CardHeader, CardContent, List, ListItem, Stack, Typography } from "@mui/material";
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
				<List>
					{sorted.map((x, index) => {
						return (
							<ListItem key={index}>
								<Stack>
									<Stack direction="row">
										<Typography variant="subtitle1">{x.name}</Typography>
										<ChaptersChip chapters={x.chapters.filter((x) => x <= chapter)} />
									</Stack>
									<Typography variant="caption">{parseNote(x, chapter)}</Typography>
									<Typography variant="caption">Source: {x.source}</Typography>
								</Stack>
							</ListItem>
						);
					})}
				</List>
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
