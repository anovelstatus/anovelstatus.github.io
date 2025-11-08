import { Button, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { SubdirectoryArrowRight, ExpandLess, ExpandMore } from "@mui/icons-material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import type { ColumnDef } from "@tanstack/react-table";
import { createCollapsedChapterColumn, createCollapsedTierColumn } from "@/components/AppTable/columns";
import { useMetalTiers } from "@/data/api";

export const columnstyles: SxProps<Theme> = {
	".nested": {
		backgroundColor: "#000",
	},
	".nested-1": {
		backgroundColor: "#111 !important",
	},
	".nested-2": {
		backgroundColor: "#080808 !important",
	},
};

export const useColumns = () => {
	const metalTiers = useMetalTiers();
	return [
		{
			accessorKey: "name",
			header: "Talent",
			size: 100,
			cell: ({ row }) => (
				<Stack direction="column">
					<Stack direction="row" flexWrap="wrap" alignItems="baseline" paddingLeft={`${row.depth * 20}px`}>
						{row.depth > 0 ? <SubdirectoryArrowRight fontSize="small" /> : null}
						<Typography variant="subtitle1">{row.original.name}</Typography>
						<RarityChip name={row.original.tier} growth={row.original.growth} />
						<ChaptersChip chapters={[row.original.chapterGained]} />
					</Stack>
					{row.getCanExpand() ? (
						<Button
							startIcon={row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
							onClick={row.getToggleExpandedHandler()}
						>
							See previous
						</Button>
					) : null}
				</Stack>
			),
			meta: {
				bodyColSpan: 3,
				bodyClassName: (cell) => {
					const depth = cell.row.depth;
					if (depth > 0) return `nested nested-${depth}`;
					return "";
				},
			},
		},
		createCollapsedTierColumn<Talent>(metalTiers),
		createCollapsedChapterColumn<Talent>((x) => x.chapterGained),
		{
			accessorKey: "note",
			header: "Description",
			size: 400,
			enableSorting: false,
			cell: ({ row }) => <Typography variant="body2">{row.original.note}</Typography>,
			meta: {
				bodyClassName: (cell) => {
					const depth = cell.row.depth;
					if (depth > 0) return `nested nested-${depth}`;
					return "";
				},
			},
		},
	] as ColumnDef<Talent>[];
};
