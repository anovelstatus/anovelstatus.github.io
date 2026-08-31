import { createCollapsedChapterColumn, createCollapsedTierColumn } from "@/components/AppTable/columns";
import { type AppTableFeatures } from "@/components/AppTable";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { RichTextSpan } from "@/components/RichTextSpan";
import { useMetalTiers } from "@/data/api";
import { Typography, Stack } from "@mui/material";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

export const useColumns = (): ColumnDef<AppTableFeatures, Achievement>[] => {
	const tiers = useMetalTiers();
	const columnHelper = createColumnHelper<AppTableFeatures, Achievement>();
	return columnHelper.columns([
		columnHelper.accessor("description", {
			header: "Description",
			size: 300,
			enableSorting: false,
			spanColumns: 3,
			cell: ({ row }) => (
				<Stack>
					<RichTextSpan data={row.original.description} />
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						<RarityChip name={row.original.tier} />
						<ChaptersChip chapters={row.original.chapter} />
					</Stack>
				</Stack>
			),
		}),
		createCollapsedChapterColumn(columnHelper, (row) => row.chapter),
		createCollapsedTierColumn(columnHelper, tiers),
		columnHelper.display({
			header: "Message",
			size: 300,
			spanColumns: 0,
			cell: ({ row }) => (
				<Stack>
					<RichTextSpan data={row.original.message} />
					<Typography variant="body2" sx={{ fontStyle: "italic" }}>
						Sent to {row.original.messageRecipients.join(", ")}
					</Typography>
				</Stack>
			),
		}),
		columnHelper.accessor("rewards", {
			header: "Rewards",
			size: 300,
			enableSorting: false,
			spanColumns: 0,
			cell: ({ row }) => <RichTextSpan data={row.original.rewards} />,
		}),
		columnHelper.accessor("note", {
			header: "Other Notes",
			size: 300,
			enableSorting: false,
			spanColumns: 0,
			cell: ({ row }) => <RichTextSpan data={row.original.note} />,
		}),
	]);
};
