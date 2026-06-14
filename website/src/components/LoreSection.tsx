import { ChaptersChip } from "@/components/chips";
import { RichTextSpan } from "@/components/RichTextSpan";
import { useChapter, useLore } from "@/data/api";
import { Stack } from "@mui/material";
import { maxBy, orderBy } from "es-toolkit";

type LoreSectionProps = {
	topic: string;
	subtopic?: string;
};

export function LoreSection({ topic, subtopic }: LoreSectionProps) {
	const chapter = useChapter();

	const realTopic = subtopic ? `${topic} - ${subtopic}` : topic;
	const lore = useLoreTopic(realTopic, chapter);

	if (!lore.description && !lore.updates.length) return <></>;

	return (
		<Stack>
			<RichTextSpan data={lore.description} />
			{lore.updates.map((update, index) => (
				<Stack direction="row" key={index}>
					<ChaptersChip chapters={[update.chapter]} />
					<RichTextSpan data={update.note} />
				</Stack>
			))}
		</Stack>
	);
}

function useLoreTopic(key: string, chapter: number) {
	const { data: lore } = useLore();
	const relevant = lore.filter((x) => x.key === key && x.chapter <= chapter);

	const description =
		maxBy(
			relevant.filter((x) => !x.permanent),
			(x) => x.chapter,
		)?.note || [];
	const updates = orderBy(
		relevant.filter((x) => x.permanent),
		[(x) => x.chapter],
		["desc"],
	);
	return { description, updates };
}
