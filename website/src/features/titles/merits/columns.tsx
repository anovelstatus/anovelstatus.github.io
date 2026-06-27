import { Box, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import {
	createColumnHelper,
	type Cell,
	type ColumnDef,
	type Header,
	type Row,
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
import { sameId, toIdString } from "@/data/helpers";

export const columnstyles: SxProps<Theme> = {
	".bought": {
		backgroundColor: "#408d40",
	},
	".unknown": {
		textAlign: "center",
		color: "#666",
	},
	".MuiTable-root": {
		width: 150 + 100 + 200 * 10 + "px",
	},
};

export const useColumns = () => {
	const columnHelper = createColumnHelper<Title>();
	const metalTiers = useMetalTiers();
	const chapter = useChapter();
	const columns = [
		{
			accessorKey: "name",
			header: "Title",
			size: 150,
			enableSorting: true,
			cell: ({ row }) => (
				<WrappedRow sx={{ paddingLeft: `${row.depth}rem` }}>
					<Typography variant="subtitle1">{row.original.name}</Typography>
					<RarityChip name={row.original.tier} />
					{row.original.noTreeReason && (
						<>
							{" - "}
							<RichTextSpan data={row.original.noTreeReason} />
						</>
					)}
				</WrappedRow>
			),
			meta: {
				bodyColSpan: (row) => {
					if (row.original.noTreeReason) return 12;
					return 2;
				},
			},
		},
		createCollapsedTierColumn<Title>(metalTiers),
	] as ColumnDef<Title>[];

	for (let i = 0; i < 10; i++) {
		const columnTierNumber = Math.max(0, i - 2);
		const columnTier = metalTiers[columnTierNumber]!;
		const tierTheme = useTheme(columnTierNumber);
		columns.push(
			columnHelper.display({
				id: "tier-" + i,
				header: (context) => (
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
					if (!merit) return "?";

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
					bodyClassName: (cell): string => {
						const chain = useTitleChain(cell.row.original);
						const merit = getMerit(chain, i, chapter);
						if (!merit) return "unknown";
						if (merit.chBought && merit.chBought <= chapter) {
							return "bought";
						}
						return "";
					},
					bodySx: (cell: Cell<Title, unknown>, table: Table<Title>): SxProps => {
						const style: SxProps = {
							backgroundColor: tierTheme.palette.primary.dark,
							//borderTopColor: tierTheme.palette.primary.main,
							//borderBottomColor: tierTheme.palette.primary.main,
						};
						const titleTier = metalTiers.indexOf(cell.row.original.tier);
						if (titleTier + 1 == columnTierNumber) {
							style.borderLeftColor = "rgb(182, 0, 0)";
							style.borderLeftWidth = 4;

							const previousRow = getPreviousRow(cell.row, table);
							if (previousRow && previousRow.original.tier !== cell.row.original.tier) {
								style.borderTopColor = "rgb(182, 0, 0)";
								style.borderTopWidth = 4;
							}
						}
						return style;
					},
					headerSx: (column: Header<Title, unknown>): SxProps => {
						return {
							backgroundColor: tierTheme.palette.primary.dark,
							//borderTopColor: tierTheme.palette.primary.main,
							borderBottomColor: tierTheme.palette.primary.main,
							textAlign: "center",
						};
					},
				},
			}),
		);
	}
	return columns;
};

function useTitleChain(title: Title) {
	const { data: titles } = useTitles();
	return useMemo(() => {
		const chain = toChain(title, titles);
		return chain;
	}, [title, titles]);
}

function toChain(title: Title, titles: Title[]) {
	const previous = getPreviousTitleChain(titles, title);
	return [title, ...previous];
}

function getMerit(chain: Title[], meritTier: number, chapter: number): TitleMerit | undefined {
	for (const title of chain) {
		const titleMerits = (title.merits ?? []).filter((x) => x.tier === meritTier && x.chReveal <= chapter);
		if (titleMerits.length === 0) continue;
		return maxBy(titleMerits, (x) => x.chReveal);
	}
	return;
}

function getPreviousRow<T>(row: Row<T>, table: Table<T>) {
	const allRows = table.getRowModel().rows;
	const index = allRows.findIndex((x) => x.id == row.id);
	return allRows[index - 1];
}
