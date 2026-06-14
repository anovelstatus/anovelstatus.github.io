import { ChaptersChip } from "@/components/chips";
import { RichTextSpan } from "@/components/RichTextSpan";
import { Stack, Typography } from "@mui/material";

type LoreCardProps = {
	lore: LoreEntry;
};

export function LoreCard({ lore }: LoreCardProps) {
	return (
		<Stack>
			<Typography variant="h6">{lore.key}</Typography>
			<Stack direction="row">
				<ChaptersChip chapters={[lore.chapter]} />
				<RichTextSpan data={lore.note} />
			</Stack>
		</Stack>
	);
}
