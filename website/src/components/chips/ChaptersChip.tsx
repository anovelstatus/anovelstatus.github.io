import { Chip } from "@mui/material";

type ChaptersChipProps = {
	chapters: number[] | number;
};

export default function ChaptersChip({ chapters }: ChaptersChipProps) {
	const label = "Ch " + (Array.isArray(chapters) ? chapters.join(", ") : chapters);
	return <Chip label={label} size="small" variant="outlined" color="default" />;
}
