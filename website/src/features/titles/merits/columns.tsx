import { Box, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import {
	createColumnHelper,
	type Cell,
	type ColumnDef,
	type Row,
	type RowData,
	type Table,
} from "@tanstack/react-table";
import { createCollapsedTierColumn } from "@/components/AppTable/columns";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import { WrappedRow } from "@/components/WrappedRow";
import { useMemo } from "react";
import { getPreviousTitleChain } from "../helpers";
import { maxBy } from "es-toolkit";
import { useTheme } from "@/data/useTheme";
import type { TableFeatures } from "@/components/AppTable";

export const columnstyles: SxProps<Theme> = {
	".bought": {
		backgroundColor: "#408d40",
	},
	".unknown": {
		textAlign: "center",
		color: "#666",
	},
	".MuiTable-root": {
		// Title + Tier + 10xTiers
		width: 150 + 100 + 200 * 10 + "px",
		minWidth: "100%",
	},
};

export const useColumns = () => {
	const columnHelper = createColumnHelper<TableFeatures, Title>();
	const metalTiers = useMetalTiers();
	const chapter = useChapter();
	const columns = [
		columnHelper.accessor("name", {
			id: "name",
			header: "Title",
			size: 150,
			enableSorting: true,
			cell: ({ row }) => (
				<Stack>
					<WrappedRow sx={{ paddingLeft: `${row.depth}rem` }}>
						<Typography variant="subtitle1">{row.original.name}</Typography>
						<RarityChip name={row.original.tier} />
					</WrappedRow>
					<RichTextSpan data={row.original.noTreeReason} />
				</Stack>
			),
			spanColumns: (ctx) => {
				if (ctx.row.original.noTreeReason) return 12;
				return 2;
			},
		}),
		createCollapsedTierColumn(columnHelper, metalTiers),
	] as ColumnDef<TableFeatures, Title>[];

	for (let i = 0; i < 10; i++) {
		const columnTierNumber = Math.max(0, i - 2);
		const columnTier = metalTiers[columnTierNumber]!;
		const tierTheme = useTheme(columnTierNumber);
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
					const chain = useTitleChain(row.original);
					const merit = getMerit(chain, i, chapter);
					// todo: Locked until title is Tier XYZ
					if (!merit) {
						const isFirstLockedCell = getIsFirstLockedCell(row, metalTiers, columnTierNumber);
						if (isFirstLockedCell && getMerit(chain, i - 1, chapter)?.chBought)
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
				spanColumns: (ctx) => {
					return ctx.row.original.noTreeReason ? 0 : 1;
				},
				bodyClassName: (cell): string => {
					const chain = useTitleChain(cell.row.original);
					const merit = getMerit(chain, i, chapter);
					if (!merit) {
						const isFirstLockedCell = getIsFirstLockedCell(cell.row, metalTiers, columnTierNumber);
						if (isFirstLockedCell && getMerit(chain, i - 1, chapter)?.chBought) return "";
						return "unknown";
					}
					if (merit.chBought && merit.chBought <= chapter) {
						return "bought";
					}
					return "";
				},
				bodySx: (cell: unknown): SxProps => {
					// todo: figure out this type issue on cell
					const realCell = cell as Cell<TableFeatures, Title>;
					const style: SxProps = {
						backgroundColor: tierTheme.palette.primary.dark,
						//borderTopColor: tierTheme.palette.primary.main,
						//borderBottomColor: tierTheme.palette.primary.main,
					};
					const isFirstLockedCell = getIsFirstLockedCell(realCell.row, metalTiers, columnTierNumber);
					if (isFirstLockedCell) {
						style.borderLeftColor = "rgb(182, 0, 0)";
						style.borderLeftWidth = 4;

						const previousRow = getPreviousRow(realCell.row, realCell.table);
						if (previousRow && previousRow.original.tier !== realCell.row.original.tier) {
							style.borderTopColor = "rgb(182, 0, 0)";
							style.borderTopWidth = 4;
						}
					}
					return style;
				},
				headerSx: (): SxProps => {
					return {
						backgroundColor: tierTheme.palette.primary.dark,
						//borderTopColor: tierTheme.palette.primary.main,
						borderBottomColor: tierTheme.palette.primary.main,
						textAlign: "center",
					};
				},
			}),
		);
	}
	return columns;
};

export function useTitleChain(title: Title) {
	const { data: titles } = useTitles();
	return useMemo(() => toChain(title, titles), [title, titles]);
}

export function toChain(title: Title, titles: Title[]) {
	const previous = getPreviousTitleChain(titles, title, true);
	return [title, ...previous];
}

export function getMerit(chain: Title[], meritTier: number, chapter: number): TitleMerit | undefined {
	for (const title of chain) {
		const titleMerits = (title.merits ?? []).filter((x) => x.tier === meritTier && x.chReveal <= chapter);
		if (titleMerits.length === 0) continue;
		return maxBy(titleMerits, (x) => x.chReveal);
	}
	return;
}

function getIsFirstLockedCell(row: Row<TableFeatures, Title>, tiers: string[], columnTierNumber: number) {
	const titleTier = tiers.indexOf(row.original.tier);
	return titleTier + 1 == columnTierNumber;
}

function getPreviousRow<T extends RowData>(row: Row<TableFeatures, T>, table: Table<TableFeatures, T>) {
	const allRows = table.getRowModel().rows;
	const index = allRows.findIndex((x) => x.id == row.id);
	return allRows[index - 1];
}
