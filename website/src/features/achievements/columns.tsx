import { createCollapsedChapterColumn, createCollapsedTierColumn } from "@/components/AppTable/columns";
import { ChaptersChip, RarityChip } from "@/components/chips";
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
					<Typography variant="body2" whiteSpace="pre-line">
						{row.original.description}
					</Typography>
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
					<Typography variant="body2" whiteSpace="pre-line">
						{row.original.message}
					</Typography>
					<Typography variant="body2" fontStyle="italic">
						Sent to {row.original.messageRecipients.join(", ")}
					</Typography>
				</Stack>
			),
		}),
		createColumnHelper<Achievement>().accessor("rewards", {
			header: "Rewards",
			size: 300,
			cell: ({ row }) => (
				<Typography variant="body2" whiteSpace="pre-line">
					{row.original.rewards}
				</Typography>
			),
		}),
		createColumnHelper<Achievement>().accessor("note", {
			header: "Other Notes",
			size: 300,
			cell: ({ row }) => (
				<Typography variant="body2" whiteSpace="pre-line">
					{row.original.note}
				</Typography>
			),
		}),
	] as ColumnDef<Achievement>[];
};
