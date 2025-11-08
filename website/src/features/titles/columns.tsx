import { Button, Grid, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { SubdirectoryArrowRight, ExpandLess, ExpandMore } from "@mui/icons-material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import type { ColumnDef } from "@tanstack/react-table";
import { createCollapsedChapterColumn, createCollapsedTierColumn } from "@/components/AppTable/columns";
import { useMetalTiers } from "@/data/api";

export const columnstyles: SxProps<Theme> = {
	".nested": {
		backgroundColor: "#090909",
	},
};

export const useColumns = () => {
	const metalTiers = useMetalTiers();
	return [
		{
			accessorKey: "name",
			header: "Title",
			size: 100,
			enableSorting: true,
			cell: ({ row }) => (
				<Stack direction="column">
					<Grid container spacing={1} alignItems="center" paddingLeft={`${row.depth * 2}rem`}>
						{row.depth > 0 ? <SubdirectoryArrowRight fontSize="small" /> : null}
						<Typography variant="subtitle1">{row.original.name}</Typography>
						<RarityChip name={row.original.tier} />
						<ChaptersChip chapters={row.original.chapter} />
					</Grid>
					{row.getCanExpand() && row.depth == 0 ? (
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
					if (cell.row.depth > 0) return "nested";
					return;
				},
			},
		},
		createCollapsedTierColumn<Title>(metalTiers),
		createCollapsedChapterColumn<Title>((x) => x.chapter),
		{
			accessorKey: "notes",
			header: "Notes",
			size: 400,
			enableSorting: false,
			cell: ({ row }) => (
				<Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
					{row.original.note}
				</Typography>
			),
			meta: {
				bodyClassName: (cell) => {
					if (cell.row.depth > 0) return "nested";
					return;
				},
			},
		},
	] as ColumnDef<Title>[];
};
