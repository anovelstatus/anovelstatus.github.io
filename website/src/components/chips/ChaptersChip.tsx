import { Chip } from "@mui/material";

type ChaptersChipProps = {
	chapters: number[] | number;
	range?: boolean;
};

export default function ChaptersChip(props: ChaptersChipProps) {
	if (!props.chapters) return null;

	const label = getLabel(props);
	return <Chip label={label} size="small" variant="filled" color="default" />;
}

function getLabel({ chapters, range }: ChaptersChipProps) {
	if (typeof chapters === "number") return "Ch " + chapters;

	if (range && chapters.length == 2) return `Ch ${chapters[0]}-${chapters[1]}`;
	return "Ch " + chapters.join(", ");
}
