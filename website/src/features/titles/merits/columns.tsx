import { Box, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { createColumnHelper, type ColumnDef, type Row, type Table } from "@tanstack/react-table";
import { RichTextSpan } from "@/components/RichTextSpan";
import { WrappedRow } from "@/components/WrappedRow";
import { type MeritFilterOptions, type TableTree } from "./helpers";
import { tierSortComparator } from "@/components/AppTable/columns";
import { useTierThemes } from "@/data/useTheme";

export function useStyles(): SxProps<Theme> {
	const tierThemes = useTierThemes();
	const styles: SxProps<Theme> = {
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
		".red-border-left": {
			borderLeftColor: "rgb(182, 0, 0)",
			borderLeftWidth: 4,
		},
		".red-border-top": {
			borderTopColor: "rgb(182, 0, 0)",
			borderTopWidth: 4,
		},
	};
	for (let i = 0; i < 9; i++) {
		const tierTheme = tierThemes[i]!;
		styles["th.tier-" + i] = {
			backgroundColor: tierTheme.palette.primary.dark,
			borderBottomColor: tierTheme.palette.primary.main,
		};
		styles["td.tier-" + i] = {
			backgroundColor: tierTheme.palette.primary.dark,
		};
	}
	return styles;
}

export function getColumns(tiers: string[]) {
	const columnHelper = createColumnHelper<TableTree>();
	const columns: ColumnDef<TableTree>[] = [
		columnHelper.display({
			id: "title",
			header: "Title",
			size: 250,
			enableSorting: true,
			sortingFn: (a, b) => tierSortComparator(tiers, a.original.tier, b.original.tier),
			cell: ({ row }) => {
				const title = row.original;
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
					if (row.original.noTreeReason) return tiers.length + 1;
					return 1;
				},
			},
		}),
	];

	for (let i = 0; i < tiers.length; i++) {
		const columnTierNumber = Math.max(0, i - 2);
		const columnTier = tiers[columnTierNumber]!;
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
						const isFirstLockedCell = getIsFirstLockedCell(row, tiers, columnTierNumber);
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
						return row.original.noTreeReason ? 0 : 1;
					},
					bodyClassName: (cell, table): string => {
						const classes: string[] = ["tier-" + columnTierNumber];
						const merit = cell.row.original.merits[i];
						if (!merit) {
							const isFirstLockedCell = getIsFirstLockedCell(cell.row, tiers, columnTierNumber);
							if (isFirstLockedCell) {
								classes.push("red-border-left");
								const title = cell.row.original;
								const previousRow = getPreviousRow(cell.row, table);
								if (previousRow) {
									const previousTitle = previousRow.original;
									if (previousTitle.tier !== title.tier) {
										classes.push("red-border-top");
									}
								}
							}
							if (isFirstLockedCell && cell.row.original.merits[i - 1]?.chBought) return "";
							else classes.push("unknown");
						}
						// todo: kinda terrible
						else if (merit.chBought) {
							classes.push("bought");
						}
						return classes.join(" ");
					},
					headerClassName: () => "tier-" + columnTierNumber,
				},
			}),
		);
	}
	return columns;
}

function getIsFirstLockedCell(row: Row<TableTree>, tiers: string[], columnTierNumber: number) {
	const titleTier = tiers.indexOf(row.original.tier);
	return titleTier + 1 == columnTierNumber;
}

function getPreviousRow<T>(row: Row<T>, table: Table<T>) {
	const allRows = table.getRowModel().rows;
	const index = allRows.findIndex((x) => x.id == row.id);
	return allRows[index - 1];
}

function getChapter(table: Table<TableTree>) {
	const filters = table.getState().globalFilter as MeritFilterOptions;
	return filters.chapter;
}
