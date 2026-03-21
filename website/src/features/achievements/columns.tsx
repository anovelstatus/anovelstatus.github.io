import { createCollapsedChapterColumn, createCollapsedTierColumn } from "@/components/AppTable/columns";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { RichTextSpan } from "@/components/RichTextSpan";
import { useMetalTiers } from "@/data/api";
import { Typography, Stack } from "@mui/material";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

export const useColumns = () => {
	const tiers = useMetalTiers();
	return [
		createColumnHelper<Achievement>().accessor("description", {
			header: "Description",
			size: 300,
			cell: ({ row }) => (
				<Stack>
					<RichTextSpan data={row.original.description} />
					<Stack direction="row" spacing={1} alignItems="center">
						<RarityChip name={row.original.tier} />
						<ChaptersChip chapters={row.original.chapter} />
					</Stack>
				</Stack>
			),
			meta: {
				bodyColSpan: 3,
			},
		}),
		createCollapsedChapterColumn<Achievement>((row) => row.chapter),
		createCollapsedTierColumn<Achievement>(tiers),
		createColumnHelper<Achievement>().display({
			header: "Message",
			size: 300,
			cell: ({ row }) => (
				<Stack>
					<RichTextSpan data={row.original.message} />
					<Typography variant="body2" fontStyle="italic">
						Sent to {row.original.messageRecipients.join(", ")}
					</Typography>
				</Stack>
			),
		}),
		createColumnHelper<Achievement>().accessor("rewards", {
			header: "Rewards",
			size: 300,
			cell: ({ row }) => <RichTextSpan data={row.original.rewards} />,
		}),
		createColumnHelper<Achievement>().accessor("note", {
			header: "Other Notes",
			size: 300,
			cell: ({ row }) => <RichTextSpan data={row.original.note} />,
		}),
	] as ColumnDef<Achievement>[];
};
