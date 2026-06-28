import { Box, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { createColumnHelper, type ColumnDef, type Header, type Row, type Table } from "@tanstack/react-table";
import { RichTextSpan } from "@/components/RichTextSpan";
import { WrappedRow } from "@/components/WrappedRow";
import { type TableTree } from "./helpers";
import { tierSortComparator } from "@/components/AppTable/columns";

export const columnstyles: SxProps<Theme> = {
	".bought": {
		backgroundColor: "#408d40",
	},
	".unknown": {
		textAlign: "center",
		color: "#666",
	},
	th: {
		textAlign: "center",
	},
	".MuiTable-root": {
		// Title + 10xTiers
		width: 250 + 200 * 10 + "px",
		minWidth: "100%",
	},
};

export const getColumns = (metalTiers: string[], themes: Theme[]) => {
	const columnHelper = createColumnHelper<TableTree>();
	const columns: ColumnDef<TableTree>[] = [
		columnHelper.display({
			id: "title",
			header: "Title",
			size: 250,
			enableSorting: true,
			sortingFn: (a, b) => tierSortComparator(metalTiers, a.original.title.tier, b.original.title.tier),
			cell: ({ row }) => {
				const title = row.original.title;
				return (
					<Stack>
						<WrappedRow sx={{ paddingLeft: `${row.depth}rem` }}>
							<Typography variant="subtitle1">{title.name}</Typography>
							<RarityChip name={title.tier} />
						</WrappedRow>
						<RichTextSpan data={title.noTreeReason} />
					</Stack>
				);
			},
			meta: {
				bodyColSpan: (row) => {
					if (row.original.title.noTreeReason) return 11;
					return 1;
				},
			},
		}),
	];

	for (let i = 0; i < 10; i++) {
		const columnTierNumber = Math.max(0, i - 2);
		const columnTier = metalTiers[columnTierNumber]!;
		const tierTheme = themes[columnTierNumber]!;
		columns.push(
			columnHelper.display({
				id: "tier-" + i,
				header: (_context) => (
					<Stack>
						<Box>Tier {i}</Box>
						<Box sx={{ fontSize: "0.95em" }}>Requires {columnTier} Title</Box>
					</Stack>
				),
				size: 200,
				cell: ({ row }) => {
					const merit = row.original.merits[i];
					if (!merit) {
						const isFirstLockedCell = getIsFirstLockedCell(row, metalTiers, columnTierNumber);
						if (isFirstLockedCell && row.original.merits[i - 1]?.chBought)
							return `LOCKED. Requires ${columnTier} Title.`;
						return "?";
					}

					return (
						<Stack>
							<RichTextSpan data={merit.text} />
							{merit.chBought && <ChaptersChip chapters={merit.chBought} />}
						</Stack>
					);
				},
				meta: {
					bodyColSpan: (row) => {
						return row.original.title?.noTreeReason ? 0 : 1;
					},
					bodyClassName: (cell): string => {
						const merit = cell.row.original.merits[i];
						if (!merit) {
							const isFirstLockedCell = getIsFirstLockedCell(cell.row, metalTiers, columnTierNumber);
							if (isFirstLockedCell && cell.row.original.merits[i - 1]?.chBought) return "";
							return "unknown";
						}
						// todo: bring back
						// if (merit.chBought && merit.chBought <= chapter) {
						// 	return "bought";
						// }
						return "";
					},
					bodySx: (cell, table): SxProps => {
						const style: SxProps = {
							backgroundColor: tierTheme.palette.primary.dark,
						};
						const isFirstLockedCell = getIsFirstLockedCell(cell.row, metalTiers, columnTierNumber);
						if (isFirstLockedCell) {
							style.borderLeftColor = "rgb(182, 0, 0)";
							style.borderLeftWidth = 4;

							const title = cell.row.original.title;
							const previousRow = getPreviousRow(cell.row, table);
							if (previousRow) {
								const previousTitle = previousRow.original.title;
								if (previousTitle.tier !== title.tier) {
									style.borderTopColor = "rgb(182, 0, 0)";
									style.borderTopWidth = 4;
								}
							}
						}
						return style;
					},
					headerSx: (_column: Header<TableTree, unknown>): SxProps => {
						return {
							backgroundColor: tierTheme.palette.primary.dark,
							borderBottomColor: tierTheme.palette.primary.main,
						};
					},
				},
			}),
		);
	}
	return columns;
};

function getIsFirstLockedCell(row: Row<TableTree>, tiers: string[], columnTierNumber: number) {
	const titleTier = tiers.indexOf(row.original.title.tier);
	return titleTier + 1 == columnTierNumber;
}

function getPreviousRow<T>(row: Row<T>, table: Table<T>) {
	const allRows = table.getRowModel().rows;
	const index = allRows.findIndex((x) => x.id == row.id);
	return allRows[index - 1];
}
