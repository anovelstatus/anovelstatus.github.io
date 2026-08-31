import { Button, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { SubdirectoryArrowRight, ExpandLess, ExpandMore } from "@mui/icons-material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { createCollapsedChapterColumn, createCollapsedTierColumn } from "@/components/AppTable/columns";
import { useMetalTiers } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import { WrappedRow } from "@/components/WrappedRow";
import type { TableFeatures } from "@/components/AppTable";

export const columnstyles: SxProps<Theme> = {
	".nested": {
		backgroundColor: "#090909",
	},
};

export const useColumns = () => {
	const metalTiers = useMetalTiers();
	const columnHelper = createColumnHelper<TableFeatures, Title>();

	// todo: use columnHelper
	return [
		{
			accessorKey: "name",
			header: "Title",
			size: 150,
			enableSorting: true,
			cell: ({ row }) => (
				<Stack direction="column">
					<WrappedRow sx={{ paddingLeft: `${row.depth}rem` }}>
						{row.depth > 0 ? <SubdirectoryArrowRight fontSize="small" /> : null}
						<Typography variant="subtitle1">{row.original.name}</Typography>
						<RarityChip name={row.original.tier} />
						<ChaptersChip chapters={row.original.chapter} />
					</WrappedRow>
					{row.getCanExpand() ? (
						<Button
							startIcon={row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
							onClick={row.getToggleExpandedHandler()}
						>
							{row.getIsExpanded() ? "Hide previous" : "See previous"}
						</Button>
					) : null}
				</Stack>
			),
			spanColumns: 3,
			bodyClassName: (cell) => {
				if (cell.row.depth > 0) return "nested";
				return;
			},
		},
		createCollapsedTierColumn(columnHelper, metalTiers),
		createCollapsedChapterColumn(columnHelper, (x) => x.chapter),
		{
			accessorKey: "notes",
			header: "Notes",
			size: 1000,
			enableSorting: false,
			cell: ({ row }) => <RichTextSpan data={row.original.note} />,
			bodyClassName: (cell) => {
				if (cell.row.depth > 0) return "nested";
				return;
			},
		},
	] as ColumnDef<TableFeatures, Title>[];
};
