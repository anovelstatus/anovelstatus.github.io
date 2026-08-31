import { Box, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import {
	createColumnHelper,
	type ColumnDef,
	type ColumnHelper,
	type Row,
	type RowData,
	type Table,
} from "@tanstack/react-table";
import { RichTextSpan } from "@/components/RichTextSpan";
import { WrappedRow } from "@/components/WrappedRow";
import { type MeritFilterOptions, type TableTree } from "./helpers";
import { tierSortComparator } from "@/components/AppTable/columns";
import { useTheme } from "@/data/useTheme";
import type { AppTableFeatures } from "@/components/AppTable";

const LIMIT = 10;

export function useStyles(): SxProps<Theme> {
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
			width: 250 + 200 * LIMIT + "px",
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
	for (let i = 0; i < LIMIT; i++) {
		const tierTheme = useTheme(i);
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

export function getColumns(tiers: string[]): ColumnDef<AppTableFeatures, TableTree>[] {
	const columnHelper = createColumnHelper<AppTableFeatures, TableTree>();
	return [
		columnHelper.display({
			id: "title",
			header: "Title",
			size: 250,
			enableSorting: true,
			sortFn: (a, b) => tierSortComparator(tiers, a.original.tier, b.original.tier),
			cell: ({ row }) => {
				return (
					<Stack>
						<WrappedRow>
							<Typography variant="subtitle1">{row.original.name}</Typography>
							<RarityChip name={row.original.tier} />
						</WrappedRow>
						<RichTextSpan data={row.original.noTreeReason} />
					</Stack>
				);
			},
			spanColumns: (ctx) => {
				if (ctx.row.original.noTreeReason) return tiers.length + 1;
				return 1;
			},
		}),
		...tiers.slice(0, LIMIT).map((_, index, tiers) => createTierColumn(columnHelper, index, tiers)),
	];
}

function createTierColumn(
	columnHelper: ColumnHelper<AppTableFeatures, TableTree>,
	i: number,
	tiers: string[],
): ColumnDef<AppTableFeatures, TableTree> {
	const columnTierNumber = Math.max(0, i - 2);
	const columnTier = tiers[columnTierNumber]!;
	return columnHelper.display({
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
				if (isFirstLockedCell && row.original.merits[i - 1]?.chBought) return `LOCKED. Requires ${columnTier} Title.`;
				return "?";
			}

			return (
				<Stack>
					<RichTextSpan data={merit.text} />
					{merit.chBought && <ChaptersChip chapters={merit.chBought} />}
				</Stack>
			);
		},
		spanColumns: (ctx) => {
			return ctx.row.original.noTreeReason ? 0 : 1;
		},
		headerClassName: () => "tier-" + columnTierNumber,
		bodyClassName: (cell): string => {
			const classes: string[] = ["tier-" + columnTierNumber];
			const merit = cell.row.original.merits[i];
			if (!merit) {
				const isFirstLockedCell = getIsFirstLockedCell(cell.row, tiers, columnTierNumber);
				if (isFirstLockedCell) {
					classes.push("red-border-left");
					const title = cell.row.original;
					const previousRow = getPreviousRow(cell.row, cell.table);
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
	});
}

function getIsFirstLockedCell(row: Row<AppTableFeatures, TableTree>, tiers: string[], columnTierNumber: number) {
	const titleTier = tiers.indexOf(row.original.tier);
	return titleTier + 1 == columnTierNumber;
}

function getPreviousRow<T extends RowData>(row: Row<AppTableFeatures, T>, table: Table<AppTableFeatures, T>) {
	const allRows = table.getRowModel().rows;
	const index = allRows.findIndex((x) => x.id == row.id);
	return allRows[index - 1];
}

function getChapter(table: Table<AppTableFeatures, TableTree>) {
	const filters = table.store.state.globalFilter as MeritFilterOptions;
	return filters.chapter;
}
